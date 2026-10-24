# io-oidis-studio

> Drag-and-drop visual editor for developing Oidis GUI components.

---

## Development

### Requirements

- [Oidis Builder](https://gitlab.com/oidis/io-oidis-builder) — required to build the project
- Node.js (see Builder documentation for the supported version)

### Building the project

The build is fully automated via the Oidis Builder.

```bash
oidis build:dev
```

For detailed build options see the [Oidis Builder](https://gitlab.com/oidis/io-oidis-builder) documentation.

### Starting the application

After a successful build, start the local server:

```bash
oidis start
```

The application will be available in your browser at `http://localhost:<port>`.

---

## Project structure

### Backend — `source/typescript/Io/Oidis/Studio/Utils/`

| File | Responsibility                                                                                                                                 |
|---|------------------------------------------------------------------------------------------------------------------------------------------------|
| `FileHelper.ts` | `@Extern` facade — exposes public methods for the frontend: load file, save file, load configs, resolve resource paths                         |
| `FileParserMarked.ts` | Extracts content from marked blocks and parses imports and variable declarations from marked files                                             |
| `FileParserUnmarked.ts` | Extracts HTML and parses imports and class field declarations from handwritten files without markers              |
| `FileWriterMarked.ts` | Replaces block content in marked files                                                     |
| `FileWriterUnmarked.ts` | Patches imports, variable declarations, constructor initializations and HTML in unmarked files; also generates a full file template from scratch |

### Frontend — `dependencies/io-oidis-studio-gui/source/typescript/Io/Oidis/Studio/Gui/`

| File / Directory | Responsibility |
|---|---|
| `Controllers/Pages/MainPageController.ts` | Main application controller — initializes GrapesJS, wires toolbar buttons, handles file open/save flow, manages config loading |
| `Connectors/FileHelperConnector.ts` | WebSocket client connector — maps frontend async calls to backend `@Extern` methods |
| `Panels/HomePanel.ts` | Root layout panel — declares all UI slots (canvas, panels, blocks, layers, styles, options, toast container) |
| `Panels/TopActionsPanel.ts` | Toolbar panel — declares action buttons (import, save, export, borders, device switcher) |
| `Dialogs/PathInputDialog.ts` | File open dialog |
| `Models/TypeRegistration.ts` | Registers all custom GrapesJS component types (heading, button, link, container, dropdown, image, …) with their traits |
| `Models/BasicComponents.ts` | Defines the block catalogue entries — maps component types to block categories and labels |
| `Models/TraitsRegistration.ts` | Registers custom GrapesJS trait types used across components |
| `Models/Options/GeneralCategory.ts` | Shared model base — `BaseComponentModel`, `GeneralTraits` (ID, OIDIS Bind), `GuiCommonsImport` constant |
| `Models/Options/FlexboxCategory.ts` | Flexbox layout trait options |
| `Models/Options/MarginPaddingCategory.ts` | Margin and padding trait options |
| `Models/Options/DisplayCategory.ts` | Display and visibility trait options |
| `Models/Options/InputCategory.ts` | Trait definitions for input, textarea and checkbox component types |
| `Bindings/TraitsBuilder.ts` | Utility that converts option category definitions into GrapesJS trait descriptors |
| `Interfaces/ILoadedFile.ts` | Shared interface for parsed file data (html, imports, variables, hasMarkers) |
| `Interfaces/IBootstrapConfig.ts` | Interface for `BootstrapConfig.json` |
| `Interfaces/IProjectConfig.ts` | Interface for `ProjectConfig.json` |

### Frontend — `dependencies/io-oidis-studio-gui/resource/`

| Path | Contents |
|---|---|
| `graphics/` | Application icons and logo |
| `sass/` | SCSS stylesheets for the editor layout (`HomePanel.scss`, `MainPage.scss`, global variables) |
| `template/` | Bundled CSS/JS for the editor page (`oidis.min.css`, `oidis.min.js`) and Bootstrap CSS injected into the GrapesJS canvas iframe |

---

## License

This software is owned or controlled by Oidis.
The use of this software is governed by the BSD-3-Clause Licence distributed with this material.

See the `LICENSE.txt` file for more details.

---

Copyright 2016-2026 [Oidis](https://www.oidis.org/)
