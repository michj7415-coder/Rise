"""Découpe un enregistrement complet de la voix off (un ou plusieurs fichiers, dans l'ordre)
en un fichier par scène, et calcule l'horaire de chaque mot de la narration.

Usage :
    python scripts/voix/decouper.py 1 partie1.mp3 partie2.mp3

Produit, pour le module N :
    public/audio/mN/<id>.mp3   une voix par scène (volume harmonisé)
    public/audio/mN/mots.json  horaire (en s, depuis le début de la scène) de chaque mot de la narration,
                               utilisé pour caler les animations et les sous-titres sur la voix.

Dépendances : faster-whisper, librosa, ffmpeg (voir scripts/voix/requirements.txt).
"""
import difflib
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

import librosa
import soundfile as sf
from faster_whisper import WhisperModel

RACINE = Path(__file__).resolve().parents[2]
SR = 16000


def normaliser(mot: str) -> str:
    mot = unicodedata.normalize("NFC", mot.lower()).replace("’", "'")
    return re.sub(r"[^a-zà-ÿœæç0-9]", "", mot)


def mots_narration(texte: str) -> list[str]:
    # Découpe identique à celle de la vidéo (src/partage/decoupage.js : mots séparés par des espaces).
    return texte.split()


def main() -> None:
    module = int(sys.argv[1])
    fichiers = sys.argv[2:]
    data = json.loads((RACINE / "src" / "data" / f"module{module}.json").read_text(encoding="utf-8"))
    sortie = RACINE / "public" / "audio" / f"m{module}"
    sortie.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        complet = Path(tmp) / "complet.wav"
        entrees = sum((["-i", f] for f in fichiers), [])
        filtre = "".join(f"[{i}:a]" for i in range(len(fichiers))) + f"concat=n={len(fichiers)}:v=0:a=1"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", *entrees, "-filter_complex", filtre, "-ar", "44100", str(complet)], check=True)
        audio44, _ = librosa.load(complet, sr=44100, mono=True)
        audio16 = librosa.resample(audio44, orig_sr=44100, target_sr=SR)

        print("Transcription (horaire de chaque mot)…", flush=True)
        modele = WhisperModel("small", device="cpu", compute_type="int8")
        segments, _ = modele.transcribe(audio16, language="fr", beam_size=5, word_timestamps=True, vad_filter=False)
        mots_w = [(w.word.strip(), w.start, w.end) for s in segments for w in s.words]
        norm_w = [normaliser(m) for m, _, _ in mots_w]

        # Narration complète, mot par mot, avec la scène de chaque mot.
        narr, scene_de = [], []
        for i, s in enumerate(data["scenes"]):
            for m in mots_narration(s["narration"]):
                narr.append(m)
                scene_de.append(i)
        norm_n = [normaliser(m) for m in narr]

        # Alignement narration ↔ transcription.
        correspond = [None] * len(narr)
        for bloc in difflib.SequenceMatcher(None, norm_n, norm_w, autojunk=False).get_matching_blocks():
            for k in range(bloc.size):
                correspond[bloc.a + k] = bloc.b + k

        # Horaire de début de chaque mot de la narration (interpolé si le mot n'a pas été reconnu).
        debuts = [mots_w[j][1] if j is not None else None for j in correspond]
        connus = [i for i, t in enumerate(debuts) if t is not None]
        for i in range(len(debuts)):
            if debuts[i] is None:
                avant = max((k for k in connus if k < i), default=None)
                apres = min((k for k in connus if k > i), default=None)
                if avant is None:
                    debuts[i] = debuts[apres]
                elif apres is None:
                    debuts[i] = debuts[avant] + 0.3 * (i - avant)
                else:
                    debuts[i] = debuts[avant] + (debuts[apres] - debuts[avant]) * (i - avant) / (apres - avant)

        # Coupures : au milieu du silence avant le premier mot de chaque scène.
        premiers = [scene_de.index(i) for i in range(len(data["scenes"]))]
        coupures = [0.0]
        for i in range(1, len(premiers)):
            k = premiers[i]
            j = correspond[k]
            if j is None:  # premier mot non reconnu : on prend le mot reconnu suivant
                j = next(correspond[x] for x in range(k, len(narr)) if correspond[x] is not None)
            fin_prec = mots_w[j - 1][2] if j > 0 else 0.0
            debut = mots_w[j][1]
            coupures.append(fin_prec + max(0.0, debut - fin_prec) * 0.5)
        coupures.append(len(audio44) / 44100)

        resultats = {}
        for i, s in enumerate(data["scenes"]):
            a, b = coupures[i], coupures[i + 1]
            morceau = audio44[int(a * 44100) : int(b * 44100)]
            brut = Path(tmp) / f"{s['id']}.wav"
            sf.write(brut, morceau, 44100)
            # Retire le silence en trop au début/à la fin (garde 0,15 s), harmonise le volume.
            filtre = (
                "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15,"
                "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15,areverse,"
                "loudnorm=I=-16:TP=-1.5:LRA=11"
            )
            fichier = sortie / f"{s['id']}.mp3"
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(brut), "-af", filtre, "-ar", "44100", "-b:a", "192k", str(fichier)], check=True)
            # Décalage dû au silence retiré au début
            nettoye, _ = librosa.load(fichier, sr=SR)
            rogne = max(0.0, (len(morceau) / 44100) - len(nettoye) / SR)  # approximation, corrigée ci-dessous
            indices = [k for k in range(len(narr)) if scene_de[k] == i]
            temps = [debuts[k] - a for k in indices]
            premier_son = librosa.effects.trim(nettoye, top_db=40)[1][0] / SR
            decalage = temps[0] - premier_son
            temps = [max(0.0, round(t - decalage, 3)) for t in temps]
            resultats[s["id"]] = temps
            reconnus = sum(1 for k in indices if correspond[k] is not None)
            print(f"✔ {fichier.relative_to(RACINE)}  {len(nettoye) / SR:5.1f} s  ({reconnus}/{len(indices)} mots reconnus)", flush=True)

        (sortie / "mots.json").write_text(json.dumps(resultats, ensure_ascii=False), encoding="utf-8")
        print(f"✔ {(sortie / 'mots.json').relative_to(RACINE)}")


if __name__ == "__main__":
    main()
