/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 * 
 * Authored by Dmytro Dovhalenko
 *
 * ********************************************************************************************************* */
import { Resolver } from "@io-oidis-commons/Io/Oidis/Commons/Primitives/Decorators.js";
import { LogIt } from "@io-oidis-commons/Io/Oidis/Commons/Utils/LogIt.js";
import { AsyncBasePageController } from "@io-oidis-services/Io/Oidis/Services/HttpProcessor/Resolvers/AsyncBasePageController.js";
import { HomePanel } from "../../Panels/HomePanel.js";
import { blocks } from "./../../Models/BasicComponents.js";
import { registerTypes } from "../../Models/TypeRegistration.js";
import { registerTraits } from "../../Models/TraitsRegistration.js";
import { ObjectValidator } from "@io-oidis-commons/Io/Oidis/Commons/Utils/ObjectValidator.js";
import { FileFetch } from "@io-oidis-services/Io/Oidis/Services/Utils/FileFetch.js";
import { FileHelperConnector } from "../../Connectors/FileHelperConnector.js";
import { BaseComponentModel, GeneralTraits, GuiCommonsImport } from "../../Models/Options/GeneralCategory.js";
import { buildTraitsFromOptions } from "../../Bindings/TraitsBuilder.js";
import { FlexboxOptions } from "../../Models/Options/FlexboxCategory.js";
import { MarginPaddingOptions } from "../../Models/Options/MarginPaddingCategory.js";
import { DisplayOptions } from "../../Models/Options/DisplayCategory.js";
import { ArrayList } from "@io-oidis-commons/Io/Oidis/Commons/Primitives/ArrayList.js";
import { IBootstrapConfig } from "../../Interfaces/IBootstrapConfig.js";
import { IProjectConfig, IProjectEntry } from "../../Interfaces/IProjectConfig.js";
import { ILoadedFile } from "../../Interfaces/ILoadedFile.js";

declare const grapesjs : any;

@Resolver("/", ["/main", "/main?{workingDir}&{path}"])
export class MainPageController extends AsyncBasePageController {
    private path : string;
    private workingDir : string;
    private projectConfig : IProjectConfig | null = null;
    private editor : any = null;
    private loadedFile : ILoadedFile | null = null;
    private lastLoadedPath : string | null = null;

    constructor() {
        super();
        this.setInstanceOwner(new HomePanel());
    }

    /*
        Reads workingDir/path from query string and persists them to sessionStorage.
        On page reload (F5) restore the URL from sessionStorage and re-navigate.
        in: $GET - parsed query parameters,
            $POST - parsed body parameters (unused)
     */
    protected argsHandler($GET : ArrayList<string>, $POST : ArrayList<any>) : void {
        super.argsHandler($GET, $POST);
        this.path       = $GET.getItem("path");
        this.workingDir = $GET.getItem("workingDir");

        if (this.path && this.workingDir) {
            sessionStorage.setItem("oidis.path",       this.path);
            sessionStorage.setItem("oidis.workingDir", this.workingDir);
        } else if (!this.path) {
            const relativePath       = sessionStorage.getItem("oidis.path");
            const workingDir = sessionStorage.getItem("oidis.workingDir");
            if(workingDir && relativePath) {
                this.getHttpManager().NavigateTo(
                `/main?workingDir=${encodeURIComponent(workingDir)}&path=${encodeURIComponent(relativePath)}`
            );
            }

        }

        if (this.editor) {
            this.onPathAvailable(<HomePanel>this.InstanceOwner());
        }
    }

    /*
        Builds the GrapesJS editor, binds command handlers and editor events. Runs once after the panel mounts.
        in: $instance - HomePanel owned by this controller
     */
    protected async afterLoad($instance : HomePanel) : Promise<void> {
        this.editor = grapesjs.init({
            container: $instance.workingArea.InstanceOwner(),
            fromElement: false,
            storageManager: false,
            layerManager: {
                appendTo: $instance.layers.InstanceOwner()
            },
            panels: {
                defaults: [
                    {
                        id: "leftPanel",
                        el: $instance.leftPanel.InstanceOwner(),
                        resizable: {
                            maxDim: 350,
                            minDim: 200,
                            tc: false,
                            cl: false,
                            cr: true,
                            bc: false,
                            keyWidth: "flex-basis"
                        }
                    },
                    {
                        id: "rightPanel",
                        el: $instance.rightPanel.InstanceOwner(),
                        resizable: {
                            maxDim: 350,
                            minDim: 200,
                            tc: false,
                            cl: true,
                            cr: false,
                            bc: false,
                            keyWidth: "flex-basis"
                        }
                    },
                    {
                        id: "bottomPanel",
                        el: $instance.bottomPanel.InstanceOwner(),
                        resizable: {
                            maxDim: 400,
                            minDim: 100,
                            tc: true,
                            bc: false,
                            cl: false,
                            cr: false,
                            keyHeight: "height"
                        }
                    }
                ] },
            traitManager: {
                appendTo: $instance.options.InstanceOwner()
            },
            blockManager: {
                appendTo: $instance.blocks.InstanceOwner(),
                custom: true,
                blocks: []
            },
            selectorManager: {
                appendTo: $instance.styles.InstanceOwner(),
                componentFirst: true,
                states: []
            },
            styleManager: {
                appendTo: $instance.styles.InstanceOwner(),
                sectors: [
                    {
                        name: "General",
                        open: true,
                        buildProps: ["display", "float", "position", "top", "right", "bottom", "left", "z-index"]
                    },
                    {
                        name: "Layout",
                        open: false,
                        buildProps: ["width", "height", "max-width", "min-height", "margin", "padding"]
                    },
                    {
                        name: "Typography",
                        open: false,
                        buildProps: [
                            "font-family", "font-size", "font-weight", "font-style",
                            "letter-spacing", "color", "line-height",
                            "text-align", "text-decoration", "text-shadow"
                        ]
                    },
                    {
                        name: "Decoration",
                        open: false,
                        buildProps: [
                            "background-color", "background",
                            "border-radius", "border",
                            "box-shadow", "opacity"
                        ]
                    },
                    {
                        name: "Flex",
                        open: false,
                        buildProps: [
                            "flex-direction", "flex-wrap",
                            "justify-content", "align-items", "align-content",
                            "order", "flex-basis", "flex-grow", "flex-shrink", "align-self"
                        ]
                    }
                ]
            },
            deviceManager: {
                devices: [
                    {
                        name: "Desktop",
                        width: ""
                    },
                    {
                        name: "Tablet",
                        width: "768px",
                        widthMedia: "992px"
                    },
                    {
                        name: "Mobile",
                        width: "375px",
                        widthMedia: "576px"
                    }
                ]
            },
            canvas: {
                styles: [
                    "resource/libs/Bootstrap/editor/bootstrap.min.css?v=123"
                ]
            }
        });

        // inject canvas-only styles (scrollbars, min-heights)
        this.editor.on("load", () => {
            const canvasDoc = this.editor.Canvas.getDocument();
            if (canvasDoc?.head) {
                const style = canvasDoc.createElement("style");
                style.textContent =
                    "[data-gjs-type=\"row\"],[data-gjs-type=\"column\"]," +
                    "[data-gjs-type=\"section\"],[data-gjs-type=\"container\"]," +
                    "[data-gjs-type=\"div\"]{min-height:30px;}" +
                    "::-webkit-scrollbar{width:5px;height:5px;}" +
                    "::-webkit-scrollbar-track{background:transparent;}" +
                    "::-webkit-scrollbar-thumb{background:#8E44AD;border-radius:3px;}" +
                    "::-webkit-scrollbar-thumb:hover{background:#8E44AD;filter:brightness(0.8);}" +
                    "::-webkit-scrollbar-button{display:none;}" +
                    "::-webkit-scrollbar-corner{background:transparent;}" +
                    "*{scrollbar-width:thin;scrollbar-color:#8E44AD transparent;}" +
                    "input[disabled],input[readonly]," +
                    "textarea[disabled],textarea[readonly]," +
                    "select[disabled]{pointer-events:auto!important;}";
                canvasDoc.head.appendChild(style);

                canvasDoc.addEventListener("mousedown", (e: MouseEvent) => {
                    const tag = (<HTMLElement>e.target).tagName;
                    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
                        e.preventDefault();
                        const el = <HTMLElement>e.target;
                        el.style.cursor = "default";
                    }
                });
                canvasDoc.addEventListener("mouseover", (e: MouseEvent) => {
                    const el = <HTMLElement>e.target;
                    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
                        el.style.cursor = "default";
                    }
                });
            }
            const stylesEl = $instance.styles.InstanceOwner();
            if (stylesEl.children.length >= 2) {
                stylesEl.insertBefore(
                    stylesEl.lastElementChild,
                    stylesEl.firstElementChild
                );
                stylesEl.lastElementChild?.classList.add("gjs-styleman-wrap");
            }
        });

        registerTraits(this.editor);
        registerTypes(this.editor);
        blocks.forEach((block) => this.editor.BlockManager.add(block.id, block));

        const htmlViewer = this.editor.CodeManager.createViewer({
            codeName: "htmlmixed",
            theme: "hopscotch",
            readOnly: 1
        });
        htmlViewer.editor.setOption("indentUnit", 2);
        htmlViewer.editor.setOption("tabSize", 2);
        $instance.bottomPanel.InstanceOwner().appendChild(htmlViewer.getElement());
        const updateExportPanel = () => {
            const scroll = htmlViewer.editor.getScrollInfo();
            const html = this.applyInlineStyles(this.editor.getHtml(), this.editor.getCss());
            htmlViewer.setContent(html);
            htmlViewer.editor.scrollTo(scroll.left, scroll.top);
        };
        updateExportPanel();

        this.editor.Panels.addPanel({
            id: "top-panel",
            el: $instance.topPanel.InstanceOwner()
        });
        this.editor.Panels.addPanel({
            id: "left-buttons",
            el: $instance.leftButtons.InstanceOwner(),
            buttons: [
                {
                    id: "show-layers",
                    active: true,
                    label: "Layers",
                    command: "ShowLayers",
                    togglable: true
                }
            ]
        });
        this.editor.Panels.addPanel({
            id: "right-buttons",
            el: $instance.rightButtons.InstanceOwner(),
            buttons: [
                {
                    id: "show-style",
                    active: true,
                    label: "Styles",
                    command: "ShowStyles",
                    togglable: true
                },
                {
                    id: "show-options",
                    label: "Options",
                    command: "ShowOptions",
                    togglable: true
                }
            ]
        });
        this.editor.Panels.addPanel({
            id: "basic-actions",
            el: $instance.topActions.InstanceOwner()
        });

        $instance.topActions.importItem.getEvents().setOnClick(() => {
            $instance.pathInputDialog.Visible(true);
            $instance.pathInputDialog.focusInput();
        });
        $instance.topActions.exportFileItem.getEvents().setOnClick(async () => {
            const comps = this.editor.getWrapper().find("*").filter((c) => c.get("oidisBindName"));
            const html = htmlViewer.editor.getValue();
            await this.saveHtmlFile(comps, html);
        });
        $instance.topActions.saveItem.getEvents().setOnClick(async () => {
            if (!this.path || !this.workingDir) return;
            const comps = this.editor.getWrapper().find("*").filter((c) => c.get("oidisBindName"));
            const html = htmlViewer.editor.getValue();
            const { importString, variableCreationString, variableInitializationString } =
                this.createOidisVariables(comps);
            if (this.loadedFile?.hasMarkers !== false) {
                await FileHelperConnector.getClient().saveFile(
                    this.getFullPath(), importString, variableCreationString, variableInitializationString, html);
            } else {
                await FileHelperConnector.getClient().saveFileUnmarked(
                    this.getFullPath(), this.loadedFile?.variables ?? [], importString,
                    variableCreationString, variableInitializationString, html);
            }
            await this.loadFileContent();
            this.showToast("File saved successfully", "success");
        });

        const deviceBtns = [
            $instance.topActions.desktopBtn,
            $instance.topActions.tabletBtn,
            $instance.topActions.mobileBtn
        ];
        const setDeviceActive = (active: typeof deviceBtns[0]) => {
            deviceBtns.forEach((btn) => btn.Active(false));
            active.Active(true);
        };

        $instance.topActions.desktopBtn.getEvents().setOnClick(() => {
            this.editor.setDevice("Desktop");
            setDeviceActive($instance.topActions.desktopBtn);
        });
        $instance.topActions.tabletBtn.getEvents().setOnClick(() => {
            this.editor.setDevice("Tablet");
            setDeviceActive($instance.topActions.tabletBtn);
        });
        $instance.topActions.mobileBtn.getEvents().setOnClick(() => {
            this.editor.setDevice("Mobile");
            setDeviceActive($instance.topActions.mobileBtn);
        });

        $instance.topActions.desktopBtn.Active(true);
        $instance.topActions.bordersItem.getEvents().setOnClick(() => this.editor.runCommand("sw-visibility"));
        $instance.topActions.exportTplItem.getEvents().setOnClick(() => this.editor.runCommand("export-template"));

        this.editor.Commands.add("ShowLayers", {
            run() {
                $instance.leftPanel.Visible(true);
            },
            stop() {
                $instance.leftPanel.Visible(false);
            }
        });
        this.editor.Commands.add("ShowStyles", {
            run(editor) {
                $instance.styles.Visible(true);
                $instance.options.Visible(false);
                editor.Panels.getButton("right-buttons", "show-options")?.set("active", false);
            },
            stop() {
                $instance.options.Visible(false);
            }
        });
        this.editor.Commands.add("ShowOptions", {
            run(editor) {
                $instance.options.Visible(true);
                $instance.styles.Visible(false);
                editor.Panels.getButton("right-buttons", "show-style")?.set("active", false);
            },
            stop() {
                $instance.options.Visible(false);
            }
        });

        this.editor.on("component:update:traits", (component) => {
                const changed = component.changedAttributes();
                Object.entries(changed).forEach(([traitName, value]:[string, string]) => {
                const trait = component.getTrait(traitName);
                if (!trait) return;

                const traitType = trait.get("traitType");
                    if (traitType === "bootstrap") {
                        const prefix = trait.get("bootstrapPrefix");

                        const options = trait.get("options") || [];
                        options
                            .map((obj) => obj.value)
                            .filter(Boolean)
                            .forEach((val) => {
                                component.removeClass(prefix + val);
                            });
                        if (value === "") return;

                        const newClass = prefix + value;
                        component.addClass(newClass);
                    }
            });
        });
        this.editor.on("update", updateExportPanel);
        this.editor.on("component:add", updateExportPanel);
        this.editor.on("component:remove", updateExportPanel);
        this.editor.on("component:update", updateExportPanel);

        this.editor.on("component:update", (comp) => {
            if (comp.get("type") !== "image") return;
            const changed = comp.changedAttributes();
            if (!("attributes" in changed)) return;
            const prevSrc = comp.previous("attributes")?.src;
            const newSrc  = comp.getAttributes().src;
            if (newSrc === prevSrc) return;
            this.resolveImageComponent(comp);
        });

        $instance.pathInputDialog.setup(
            (workingDir, relativePath) => {
                this.getHttpManager().NavigateTo(
                    `/main?workingDir=${encodeURIComponent(workingDir)}&path=${encodeURIComponent(relativePath)}`
                );
            },
            () => {
                if (this.path && this.workingDir) {
                    $instance.pathInputDialog.Visible(false);
                }
            }
        );

        this.onPathAvailable($instance);
    }

    /*
        Decides what to show after the URL is resolved: load the requested file or open the path picker.
        in: $instance - HomePanel
     */
    private onPathAvailable($instance : HomePanel) : void {
        if (this.path && this.workingDir) {
            $instance.pathInputDialog.Visible(false);
            const fullPath = this.getFullPath();
            if (fullPath === this.lastLoadedPath) return;
            this.lastLoadedPath = fullPath;
            this.loadConfig()
                .then(() => this.loadFileContent())
                .catch((e) => LogIt.Debug("Failed to load file:", e));
        } else {
            $instance.pathInputDialog.Visible(true);
            $instance.pathInputDialog.focusInput();
        }
    }

    /*
        Joins workingDir and path using the separator already present in workingDir.
        out: full absolute path to the target file
     */
    private getFullPath() : string {
        const sep = this.workingDir.includes("\\") ? "\\" : "/";
        return this.workingDir + sep + this.path;
    }

    /*
        Loads BootstrapConfig and ProjectConfig for the current workingDir, applies them to the editor once per
        path change. Called only from onPathAvailable — not on every save.
     */
    private async loadConfig() : Promise<void> {
        const result = await FileHelperConnector.getClient().getBootstrapConfigFile(this.workingDir);
        const bootstrapConfig : IBootstrapConfig | null = result?.bootstrapConfig ?? null;
        this.projectConfig = result?.projectConfig ?? null;

        if (!ObjectValidator.IsEmptyOrNull(bootstrapConfig)) {
            this.showToast("Bootstrap config loaded", "info");
        }
        if (!ObjectValidator.IsEmptyOrNull(this.projectConfig)) {
            this.showToast("Project config loaded", "info");
        }

        // append BootstrapConfig classes to importGeneration of existing types so importVariant trait offers them
        if (!ObjectValidator.IsEmptyOrNull(bootstrapConfig)) {
            bootstrapConfig.components.forEach((cfg) => {
                cfg.name.forEach((typeName) => {
                    const type = this.editor.DomComponents.getType(typeName);
                    if (!type) return;
                    const defaults = type.model.prototype.defaults;
                    if (!defaults.importGeneration) {
                        defaults.importGeneration = [];
                    }
                    const exists = defaults.importGeneration.find((i) => i.path === cfg.path);
                    if (!exists) {
                        defaults.importGeneration.push({ className: cfg.className, path: cfg.path });
                    }
                });
            });
            this.editor.getWrapper().find("*").forEach((comp) => {
                if (comp.setupImportVariantTrait) {
                    comp.setupImportVariantTrait();
                }
            });
        }

        // register custom project types and matching blocks declared in ProjectConfig.json
        if (!ObjectValidator.IsEmptyOrNull(this.projectConfig)) {
            const allTraits =
                [...GeneralTraits,
                 ...buildTraitsFromOptions(FlexboxOptions),
                 ...buildTraitsFromOptions(MarginPaddingOptions),
                 ...buildTraitsFromOptions(DisplayOptions)];
            this.projectConfig.components.forEach((cfg : IProjectEntry) => {
                this.editor.DomComponents.addType(cfg.name, {
                    extend: "base-component",
                    model: {
                        ...BaseComponentModel,
                        defaults: {
                            ...BaseComponentModel.defaults,
                            name: cfg.label ?? cfg.className,
                            tagName: "div",
                            components: cfg.htmlPattern,
                            importGeneration: [
                                GuiCommonsImport,
                                { className: cfg.className, path: cfg.path }
                            ],
                            traits: allTraits
                        },

                        init() {
                            BaseComponentModel.init.call(this);
                            this.lockPlaceholderChildren(this.components());
                        },

                        lockPlaceholderChildren(collection) {
                            collection.each((comp) => {
                                comp.set({ selectable: false, hoverable: false });
                                this.lockPlaceholderChildren(comp.components());
                            });
                        },

                        // exports only the outer wrapper — placeholder children are only visual
                        toHTML() {
                            const tag = this.get("tagName") || "div";
                            const attrs = this.getAttributes();
                            const classes = this.getClasses();
                            if (classes.length) {
                                attrs.class = classes.join(" ");
                            }
                            const attrStr = Object.entries(attrs)
                                .filter(([, v]) => v !== null && v !== undefined)
                                .map(([k, v]) => String(v) === "" ? k : `${k}="${String(v)}"`)
                                .join(" ");
                            return `<${tag}${attrStr ? " " + attrStr : ""}></${tag}>`;
                        }
                    }
                });
                this.editor.BlockManager.add(cfg.name, {
                    label: cfg.label ?? cfg.className,
                    category: cfg.category ?? "Custom components",
                    content: { type: cfg.name }
                });
            });
        }
    }

    /*
        Loads the file metadata and renders its HTML into the editor.
        Called both on initial open and after every save.
     */
    private async loadFileContent() : Promise<void> {
        const metadata : ILoadedFile | null = await FileHelperConnector.getClient().loadFileByPath(this.getFullPath());

        if (!metadata) {
            this.showToast("File not found", "danger");
            return;
        }

        if (metadata.html === null) {
            this.showToast("File is not a valid Oidis panel", "danger");
            return;
        }

        this.loadedFile = metadata;
        LogIt.Debug("File loaded, hasMarkers:", metadata.hasMarkers);

        if (metadata.html === "") {
            this.editor.setComponents("");
            return;
        }

        // render HTML into the editor
        let html = metadata.html;
        const filteredMetadata : ILoadedFile = metadata.hasMarkers ?
            metadata :
            this.filterMetadataByBindNames(metadata, html);
        this.loadedFile = filteredMetadata;
        const varToType = !ObjectValidator.IsEmptyOrNull(this.projectConfig) ?
            this.buildVarToTypeMap(filteredMetadata, this.projectConfig) :
            new Map<string, string>();
        html = this.preprocessHtml(html, varToType);
        this.editor.setComponents(html);
        this.applyImportVariantsFromFile(filteredMetadata.variables);
        this.editor.select(this.editor.getWrapper());
        await this.resolveImageResources();
    }

    /*
        Patches canvas DOM <img> elements whose src starts with /resource/ to a data URL
        fetched from the opened project's GUI dependency root.
        Only the live DOM is updated — model attributes keep the original relative path
        so save output is unaffected.
     */
    private async resolveImageResources(): Promise<void> {
        if (!this.workingDir) return;
        const images = this.editor.getWrapper().find("img");
        for (const comp of images) {
            await this.resolveImageComponent(comp);
        }
    }

    /*
        Creates and shows a Bootstrap toast notification at runtime, then removes it from the DOM after dismiss.
        in: message - text to display,
            type - Bootstrap color variant (success, info, warning, danger)
     */
    private showToast(message: string, type: "success" | "info" | "warning" | "danger"): void {
        const container = (<HomePanel>this.InstanceOwner())?.toastContainer.InstanceOwner();
        if (!container) return;
        const el = document.createElement("div");
        el.className = `toast align-items-center text-white bg-${type} border-0`;
        el.setAttribute("role", type === "danger" ? "alert" : "status");
        el.setAttribute("aria-live", type === "danger" ? "assertive" : "polite");
        el.setAttribute("aria-atomic", "true");
        el.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>`;
        container.appendChild(el);
        const toast = new (<any>globalThis).bootstrap.Toast(el, { animation: true, autohide: true, delay: 3000 });
        el.addEventListener("hidden.bs.toast", () => el.remove());
        toast.show();
    }

    /*
        Derives the absolute GUI project root from workingDir and the opened file path.
        out: absolute path to the GUI project root, or null if path does not contain a source/ segment
     */
    private getGuiRoot(): string | null {
        if (!this.workingDir || !this.path) return null;
        const guiRelRoot = this.path.split(/[/\\]source[/\\]/)[0];
        if (!guiRelRoot || guiRelRoot === this.path) return null;
        const sep = this.workingDir.includes("\\") ? "\\" : "/";
        return this.workingDir + sep + guiRelRoot;
    }

    /*
        Resolves a single image component's src if it points to a /resource/ path.
        in: comp - GrapesJS component of type image
     */
    private async resolveImageComponent(comp: any): Promise<void> {
        const guiRoot = this.getGuiRoot();
        if (!guiRoot) return;
        const src: string = comp.getAttributes().src || "";
        if (!src.startsWith("/resource/")) return;
        const dataUrl = await FileHelperConnector.getClient()
            .getResourceAsDataUrl(encodeURIComponent(guiRoot), src);
        if (!dataUrl) return;
        const el = <HTMLImageElement>comp.getEl();
        if (el) el.src = dataUrl;
    }

    /*
        Drops variables and imports that are not referenced by data-oidis-bind in the HTML.
        Used for unmarked files where the parser returns every class field/import in the source.
        in: metadata - full parsed file data,
            html - the inner HTML extracted from innerHtml()
        out: metadata copy with variables/imports narrowed to HTML-bound classes
     */
    private filterMetadataByBindNames(metadata : ILoadedFile, html : string) : ILoadedFile {
        const bindNames : Set<string> = this.extractBindNames(html);
        const variables = metadata.variables.filter((v) => bindNames.has(v.varName));
        const usedClassNames = new Set(variables.map((v) => v.className));
        const imports = metadata.imports.filter((i) => usedClassNames.has(i.className));
        return { ...metadata, variables, imports };
    }

    /*
        Extracts bind variable names from data-oidis-bind="${this.X}" attributes inside the HTML.
        in: html - HTML fragment to scan
        out: set of variable names (X) referenced in the markup
     */
    private extractBindNames(html : string) : Set<string> {
        const names  = new Set<string>();
        const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
        doc.querySelectorAll("[data-oidis-bind]").forEach((el) => {
            const bind = el.getAttribute("data-oidis-bind");
            const match = bind?.match(/\$\{this\.(\w+)\}/);
            if (match) names.add(match[1]);
        });
        return names;
    }

    /*
        Pairs each variable with its type in ProjectConfig.
        in: metadata - file metadata with variables and imports,
            projectConfig - parsed ProjectConfig.json
        out: map varName -> GrapesJS type name
     */
    private buildVarToTypeMap(metadata : ILoadedFile, projectConfig : IProjectConfig) : Map<string, string> {
        const map = new Map<string, string>();
        metadata.variables.forEach((v) => {
            const imp = metadata.imports.find((i) => i.className === v.className);
            if (!imp) return;
            const cfg = projectConfig.components.find((c) =>
                c.className === v.className && c.path === imp.path
            );
            if (cfg) {
                map.set(v.varName, cfg.name);
            }
        });
        return map;
    }

    /*
        Selects the correct importVariant on each mounted component based on the className parsed from the source file.
        in: fileVars - variables parsed from the file
     */
    private applyImportVariantsFromFile(fileVars : Array<{ varName: string; className: string }>) : void {
        const varClassMap = new Map(fileVars.map((v) => [v.varName, v.className]));
        this.editor.getWrapper().find("*").forEach((comp) => {
            const bindName = comp.get("oidisBindName");
            if (!bindName) return;
            const className = varClassMap.get(bindName);
            if (!className) return;
            const importGeneration : any[] = comp.get("importGeneration") || [];
            if (importGeneration.some((i) => i.className === className)) {
                comp.set("importVariant", className);
            }
        });
    }

    /*
        Stamps data-gjs-type on every element that has data-oidis-bind, so GrapesJS instantiates the project type
        instead of a plain div.
        in: html - HTML to render,
            varToType - varName -> GrapesJS type id map
        out: HTML with data-gjs-type attributes set
     */
    private preprocessHtml(html : string, varToType : Map<string, string>) : string {
        const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
        doc.querySelectorAll("[data-oidis-bind]").forEach((el) => {
            const bind = el.getAttribute("data-oidis-bind");
            const match = bind?.match(/\$\{this\.(\w+)\}/);
            if (!match) return;
            const typeId = varToType.get(match[1]);
            if (!typeId) return;
            el.setAttribute("data-gjs-type", typeId);
            el.innerHTML = "";
        });
        return doc.body.innerHTML;
    }

    /*
        Generates a complete BasePanel-derived TS file from scratch, used by the standalone HTML export.
        in: importString - generated import lines,
            className - class name for the new file,
            variableCreationString - field declarations,
            variableInitializationString - assignments inside the constructor,
            html - inner HTML body
        out: full TS source code as a string
     */
    private buildTemplate(importString :string, className:string, variableCreationString:string, variableInitializationString:string,
                          html:string): string {
        return `
/*! ******************************************************************************************************** *
*
* Copyright 2026 Oidis
*
* SPDX-License-Identifier: BSD-3-Clause
* The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
* or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
*
 * ********************************************************************************************************* */
import { BasePanel } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/BasePanel.js";
//generated imports start
${importString}//generated imports end
            
export class ${className} extends BasePanel {
    //generated variables start
${variableCreationString}    //generated variables end

    constructor() {
        super();
        //generated inicialization start
${variableInitializationString}        //generated inicialization end
    }

    protected innerHtml() : string {
        //generated html start
        return \`
${html}
        \`;
        //generated html end
    }
}`;
    }

    /*
        Produces three TS source fragments to be inserted into the marked blocks.
        in: comps - components carrying oidisBindName
        out: importString, variableCreationString, variableInitializationString
     */
    private createOidisVariables(comps:any[]) : {
        importString : string,
        variableCreationString : string,
        variableInitializationString : string,
    } {
        const importStringGeneration = (classname:string, path:string) => {
            return `import {${classname}} from "${path}";`;
        };
        const variableCreationStringGeneration = (variableName:string, classname:string) => {
            return `public readonly ${variableName} : ${classname};`;
        };
        const variableInitializationStringGeneration = (variableName:string, classname:string) => {
            return `this.${variableName} = new ${classname}();`;
        };

        let importString = "";
        let variableCreationString = "";
        let variableInitializationString = "";
        const classIndent = "    ";
        const bodyIndent  = "        ";

        comps.forEach((comp) => {
            const variableName = comp.get("oidisBindName");
            const importVariant = comp.get("importVariant");
            if (!variableName) return;

            const selectedImport = importVariant ?
                comp.get("importGeneration").find((i) => i.className === importVariant) :
                comp.get("importGeneration")[0];
            if (!selectedImport) return;

            const { className, path } = selectedImport;

            if(!importString.includes(path)) {
                importString += importStringGeneration(className, path) + "\n";
            }
            variableCreationString    += classIndent + variableCreationStringGeneration(variableName, className) + "\n";
            variableInitializationString += bodyIndent + variableInitializationStringGeneration(variableName, className) + "\n";
        });
        return {
            importString,
            variableCreationString,
            variableInitializationString
        };
    }

    /*
        Standalone export: prompts for a filename, builds a full TS file via buildTemplate and triggers a browser download.
        in: comps - components used to generate imports/variables,
            html - HTML body to embed
     */
    private async saveHtmlFile(comps:any[], html: string) : Promise<void> {
        const fileName = prompt("Export file name", "ExportHTML.ts");
        if (!fileName) return;
        const { importString, variableCreationString, variableInitializationString } = this.createOidisVariables(comps);
        const className = fileName.replace(".ts", "");
        const fileContent = this.buildTemplate(importString, className, variableCreationString, variableInitializationString, html);

        const blob = new Blob([fileContent], { type: "text/plain" });

        await new FileFetch().Open({
            content: blob,
            fileName: fileName,
            saveAsFile: true
        });
    }

    /*
        Folds the editor's CSS rules into inline style attributes so the export preview renders without an external sheet.
        Skips global selectors (*, :root, html, body), strips GrapesJS-generated short ids, and collapses boolean attributes.
        in: html - editor HTML,
            css - editor CSS
        out: HTML with inline styles applied
     */
    private applyInlineStyles(html: string, css: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");

        if (!css.trim()) {
            return doc.body.innerHTML;
        }

        const ruleRegex = /([^{@][^{]*)\{([^}]+)\}/g;
        let match: RegExpExecArray | null;

        while ((match = ruleRegex.exec(css)) !== null) {
            const selector = match[1].trim();
            const declarations = match[2].trim();

            if (!selector || !declarations) continue;
            if (
                selector.includes("*") ||
                /^:root\b/.test(selector) ||
                /^html\b/.test(selector) ||
                /^body\b/.test(selector)
            ) continue;

            let elements: NodeListOf<Element>;
            try {
                elements = doc.querySelectorAll(selector);
            } catch {
                continue;
            }

            elements.forEach((el) => {
                const htmlEl = <HTMLElement>el;
                const existing = htmlEl.style.cssText;
                htmlEl.style.cssText = declarations + (existing ? ";" + existing : "");
            });
        }
        doc.querySelectorAll("[id]").forEach((el) => {
            const id = el.getAttribute("id") || "";
            if (/^[a-z0-9]{4,6}$/.test(id)) {
                el.removeAttribute("id");
            }
        });

        const booleanAttrs = [
            "autofocus", "required", "readonly", "disabled", "active",
            "checked", "selected", "multiple", "muted",
            "controls", "loop", "autoplay", "defer", "async"
        ];
        let result = doc.body.innerHTML;
        booleanAttrs.forEach((attr) => {
            result = result.replace(new RegExp(`\\s${attr}=""`, "g"), ` ${attr}`);
        });

        return result;
    }
}
