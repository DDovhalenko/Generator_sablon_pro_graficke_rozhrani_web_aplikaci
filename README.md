# Oidis Studio — Generátor šablon pro grafické rozhraní webových aplikací postavených na platformě OIDIS

Originalní repozitaře projektu:
https://gitlab.com/oidis/io-oidis-studio
https://gitlab.com/oidis/io-oidis-studio-gui

Ukazkove video:
https://www.dropbox.com/scl/fi/j98wf1q86peambv8y3o5g/Video.mp4?rlkey=shq2nvj39cjmjdgfgqb7oko9x&st=rwcl1yt0&dl=0

Oidis Studio je drag-and-drop vizuální editor pro vývoj GUI komponent aplikací postavených na frameworku Oidis.

Autor Dmytro Dovhalenko

---

## Obsah složky

### `io-oidis-studio-source`

Zdrojové kódy aplikace Oidis Studio. Obsahuje TypeScript zdrojové soubory backendu i frontendu a konfiguraci projektu. Složka obsahuje vlastní **README**.

### `io-oidis-studio-compiled`

Sestavená spustitelná verze aplikace pro operační systém **Windows**. Nevyžaduje instalaci žádných dodatečných závislostí — vše potřebné je součástí složky. Složka obsahuje vlastní **README** s návodem ke spuštění a ovládání editoru.

### `technical-report`

Text diplomové práce ve formátu PDF (`DP_Dovhalenko.pdf`) a zdrojové kódy dokumentu v LaTeXu (`DP_Latex/`).

### `test-project`

Testovací projekt simulující reálnou aplikaci postavenou na frameworku Oidis. Obsahuje pouze soubory nezbytné pro práci s editorem:

- **Konfigurační soubory** pro načtení komponent v editoru:
  - `test-project/bin/project/configs/ProjectConfig.json` — komponenty specifické pro projekt.
  - `test-project/dependencies/io-oidis-usercontrols/bin/project/configs/BootstrapConfig.json` — mapování Oidis tříd na Bootstrap komponenty v editoru.
- **Panely pro otevření v editoru** — TypeScript soubory komponent ve složce:
  `test-project/dependencies/io-oidis-studio-test-gui/source/typescript/Io/Oidis/Studio/Gui/Panels/`
  - `HeaderPanel.ts`
  - `FooterPanel.ts`
  - `HomePanel.ts`
  - `MainComponent.ts`
  - `TestComponent.ts`

Pro testování je také možné použít komponenty ze zdrojových souborů samotné aplikace:
- `io-oidis-studio-source\dependencies\io-oidis-studio-gui\source\typescript\Io\Oidis\Studio\Gui\Panels`
- `io-oidis-studio-source\dependencies\io-oidis-studio-gui\source\typescript\Io\Oidis\Studio\Gui\Dialogs`
