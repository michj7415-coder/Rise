"""Génère les voix off d'un chapitre avec une voix de synthèse (Chatterbox multilingue, licence MIT).

Usage :
    python tools/voix/generer.py module-04-ch1               (toutes les scènes)
    python tools/voix/generer.py module-04-ch1 03-sel-potassium  (une seule scène)
Options :
    --reference fichier.wav   voix de référence (10 à 20 s) à imiter, dont tu as les droits
    --expressivite 0.5        de 0.25 (posé) à 1.0 (très expressif)
    --remplacer               régénère même si le mp3 existe déjà

Chaque fichier est écrit dans voice/<chapitre>/<id>.mp3. Le texte lu est exactement
le champ « voix » du JSON.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
PAUSE_ENTRE_PHRASES = 0.35  # secondes


def phrases(texte: str, max_car: int = 220) -> list[str]:
    """Découpe le texte en phrases (le modèle est plus naturel sur des phrases courtes)."""
    morceaux = [p.strip() for p in re.findall(r"[^.!?…]+[.!?…]*", texte) if p.strip()]
    resultat = []
    for p in morceaux:
        while len(p) > max_car:
            coupe = p.rfind(",", 0, max_car)
            if coupe < 40:
                coupe = p.rfind(" ", 0, max_car)
            resultat.append(p[: coupe + 1].strip())
            p = p[coupe + 1 :].strip()
        resultat.append(p)
    return resultat


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("chapitre")
    parser.add_argument("scenes", nargs="*")
    parser.add_argument("--reference", default=None)
    parser.add_argument("--expressivite", type=float, default=0.5)
    parser.add_argument("--remplacer", action="store_true")
    args = parser.parse_args()

    script = json.loads((RACINE / "scripts" / f"{args.chapitre}.json").read_text(encoding="utf-8"))
    scenes = [s for s in script["scenes"] if not args.scenes or s["id"] in args.scenes]
    dossier = RACINE / "voice" / args.chapitre
    dossier.mkdir(parents=True, exist_ok=True)

    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    torch.set_num_threads(max(1, torch.get_num_threads()))
    appareil = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Chargement du modèle ({appareil})…", flush=True)
    modele = ChatterboxMultilingualTTS.from_pretrained(device=appareil)
    silence = torch.zeros(1, int(PAUSE_ENTRE_PHRASES * modele.sr))

    for s in scenes:
        sortie = dossier / f"{s['id']}.mp3"
        if sortie.exists() and not args.remplacer:
            print(f"= {sortie.relative_to(RACINE)} existe déjà (--remplacer pour le refaire)")
            continue
        morceaux = []
        for i, p in enumerate(phrases(s["voix"])):
            torch.manual_seed(1234 + i)  # résultat reproductible
            wav = modele.generate(
                p,
                language_id="fr",
                audio_prompt_path=args.reference,
                exaggeration=args.expressivite,
                cfg_weight=0.5,
            )
            morceaux += [wav.cpu(), silence]
        audio = torch.cat(morceaux[:-1], dim=1)
        with tempfile.TemporaryDirectory() as tmp:
            brut = Path(tmp) / "brut.wav"
            ta.save(str(brut), audio, modele.sr)
            # Retire les silences au début/à la fin, harmonise le volume, encode en mp3.
            filtre = (
                "silenceremove=start_periods=1:start_threshold=-45dB,"
                "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                "loudnorm=I=-16:TP=-1.5:LRA=11"
            )
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-i", str(brut), "-af", filtre, "-ar", "44100", "-b:a", "160k", str(sortie)],
                check=True,
            )
        print(f"✔ {sortie.relative_to(RACINE)}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
