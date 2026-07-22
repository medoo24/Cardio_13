# RhythmLab — Interactive Arrhythmias & Cardiac Arrest

A self-contained interactive learning website rebuilt from the supplied **Arrhythmias and Cardiac Arrest** study chapter.

## Open the website

1. Extract the ZIP archive.
2. Open `index.html` in a recent version of Google Chrome or Microsoft Edge.
3. No installation or build step is required.

For the most consistent browser behavior, serve the folder locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main features

- Fifteen interconnected modules with previous/next navigation and persistent visited-module progress.
- Detailed coverage of electrical mechanisms, rhythm description, narrow and wide tachycardias, AF/flutter, bradycardia and AV block, WPW, treatment, BLS, ALS, and post-arrest care.
- Responsive sidebar, full-chapter search, print support, bookmarks, and offline operation.
- A separate **Listen** button for every compact learning block using browser text-to-speech.
- Schematic ECG rhythm gallery for sinus rhythm, SVT, flutter, AF, monomorphic VT, torsades, VF, and complete AV block.
- Interactive rhythm-triage engine, monitoring selector, CHA₂DS₂-VA calculator, WPW safety explorer, cardiac-arrest pathway explorer, and CPR cadence trainer.
- Twelve active-recall flashcards and a 15-question clinical case quiz with immediate explanations.
- The supplied PDF is included in `assets/` and linked from the Sources module.

## Text-to-speech

The website uses the browser Web Speech API and first requests **Google UK English Female**. If that exact voice is unavailable, it selects the closest available British-English voice and then another English voice.

Voice availability depends on the browser and operating system. Chrome and Edge usually provide the strongest compatibility. Use the speed selector in the top bar to change narration speed; the square Stop button cancels speech immediately.

## Project structure

- `index.html` — application shell, navigation, search, bookmark dialog, and accessibility landmarks.
- `styles.css` — responsive visual design, components, ECG grids, tools, and print layout.
- `js/content.js` — route metadata, structured medical content, ECG schematics, flashcards, and quiz data.
- `js/app.js` — routing, progress, search, TTS, bookmarks, calculators, quiz, metronome, and interactive tools.
- `assets/arrhythmias-and-cardiac-arrest-source.pdf` — supplied source chapter.

## Medical scope

This is an educational study aid. It is not a patient-specific diagnostic, prescribing, cardioversion, defibrillation, pacing, anticoagulation, or resuscitation protocol. Exact doses, energies, device indications, contraindications, and treatment sequences must follow current institutional guidance and trained clinical leadership.

## Guideline references

The Sources module links to official guideline pages, including:

- 2024 ESC Guidelines for atrial fibrillation.
- 2022 ESC Guidelines for ventricular arrhythmias and sudden cardiac death.
- 2021 ESC Guidelines for cardiac pacing and CRT.
- 2025 AHA Guidelines for CPR and Emergency Cardiovascular Care.
