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

import { buildTraitsFromOptions } from "../Bindings/TraitsBuilder.js";
import { FlexboxOptions } from "./Options/FlexboxCategory.js";
import { MarginPaddingOptions } from "./Options/MarginPaddingCategory.js";
import { DisplayOptions } from "./Options/DisplayCategory.js";
import {
    BaseComponentModel,
    GeneralCategory,
    GeneralTraits, GuiCommonsImport
} from "./Options/GeneralCategory.js";
import {
    InputGeneralTraits, InputValidationTraits,
    TextareaGeneralTraits, TextareaInputTraits,
    CheckboxGeneralTraits,
    initInputTraits, updateInputTrait
} from "./Options/InputCategory.js";

export function registerTypes(editor) {
    const editorTypes = editor.DomComponents;
    const allTraits =
        [...GeneralTraits,
         ...buildTraitsFromOptions(FlexboxOptions),
         ...buildTraitsFromOptions(MarginPaddingOptions),
         ...buildTraitsFromOptions(DisplayOptions)];

    editorTypes.addType("base-component", {
        model: {
            ...BaseComponentModel
        }
    });

    editorTypes.addType("base-text-component", {
        extend: "text",
        model: {
            ...BaseComponentModel
        }
    });

    // Override built-in "default" so unknown elements inherit BaseComponentModel.
    // Whitelisted tags fall through to GrapesJS built-in types.
    const builtinHandledTags = new Set([
        "IMG", "A", "VIDEO", "AUDIO", "SOURCE", "TRACK",
        "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TD", "TH", "CAPTION",
        "SVG", "MAP", "AREA", "IFRAME", "SCRIPT", "STYLE", "LABEL"
    ]);
    editorTypes.addType("default", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (!el || !el.tagName) return false;
            if (builtinHandledTags.has(el.tagName)) return false;
            return true;
        },
        model: {
            defaults: {
                ...BaseComponentModel.defaults,
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });

    editorTypes.addType("heading", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            /^H[1-6]$/.test(el.tagName) ? { type: "heading" } : false,

        model: {
            defaults: {
                tagName: "h1",
                content: "Heading",
                headingLevel: "h1",
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "headingLevel",
                        label: "Level",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "h1", label: "H1", value: "h1" },
                            { id: "h2", label: "H2", value: "h2" },
                            { id: "h3", label: "H3", value: "h3" },
                            { id: "h4", label: "H4", value: "h4" },
                            { id: "h5", label: "H5", value: "h5" },
                            { id: "h6", label: "H6", value: "h6" }
                        ]
                    },
                    {
                        type: "select",
                        name: "displayClass",
                        label: "Display",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "display-1", label: "Display 1", value: "display-1" },
                            { id: "display-2", label: "Display 2", value: "display-2" },
                            { id: "display-3", label: "Display 3", value: "display-3" },
                            { id: "display-4", label: "Display 4", value: "display-4" },
                            { id: "display-5", label: "Display 5", value: "display-5" },
                            { id: "display-6", label: "Display 6", value: "display-6" }
                        ]
                    },
                    ...allTraits
                ]
            },

            init() {
                this.set("headingLevel", this.get("tagName"));
                const displayClass = this.getClasses().find((cls) => /^display-[1-6]$/.test(cls));
                this.set("displayClass", displayClass || "", { silent: true });
            },

            updated(property, value) {
                if (property === "headingLevel" && value) {
                    this.set("tagName", value);
                }
                if (property === "displayClass") {
                    this.getClasses()
                        .filter((cls) => /^display-[1-6]$/.test(cls))
                        .forEach((cls) => this.removeClass(cls));
                    if (value) {
                        this.addClass(value);
                    }
                }
            }
        }
    });

    editorTypes.addType("paragraph", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "P",
        model: {
            defaults: {
                tagName: "p",
                content: "Paragraph",
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });

    editorTypes.addType("span", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "SPAN",
        model: {
            defaults: {
                tagName: "span",
                content: "Span",
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });
    editorTypes.addType("italic", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "EM" || el.tagName === "I",
        model: {
            defaults: {
                tagName: "em",
                content: "Italic",
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "tag",
                        label: "Tag",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "em", label: "Em", value: "em" },
                            { id: "i", label: "I", value: "i" }
                        ]
                    },
                    ...allTraits
                ]
            },

            init() {
                this.set("tag", this.get("tagName"));
            },

            updated(property, value) {
                if (property === "tag" && value) {
                    this.set("tagName", value);
                }
            }
        }
    });
    editorTypes.addType("small", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "SMALL",
        model: {
            defaults: {
                tagName: "small",
                content: "Small",
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });
    editorTypes.addType("bold", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "STRONG" || el.tagName === "B",
        model: {
            defaults: {
                tagName: "strong",
                content: "Bold",
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "tag",
                        label: "Tag",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "strong", label: "Strong", value: "strong" },
                            { id: "b", label: "B", value: "b" }
                        ]
                    },
                    ...allTraits
                ]
            },

            init() {
                this.set("tag", this.get("tagName"));
            },

            updated(property, value) {
                if (property === "tag" && value) {
                    this.set("tagName", value);
                }
            }
        }
    });

    editorTypes.addType("list", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "UL" || el.tagName === "OL",
        model: {
            defaults: {
                tagName: "ul",
                components: [
                    {
                        tagName: "li",
                        content: "Item 1"
                    },
                    {
                        tagName: "li",
                        content: "Item 2"
                    }, {
                        tagName: "li",
                        content: "Item 3"
                    }, {
                        tagName: "li",
                        content: "Item 4"
                    }
                ],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "listStyle",
                        label: "Style",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "unordered", label: "Unordered (UL)", value: "ul" },
                            { id: "ordered", label: "Ordered (OL)", value: "ol" },
                            { id: "unstyled", label: "Unstyled (UL)", value: "list-unstyled" },
                            { id: "inline", label: "Inline (UL)", value: "list-inline" }
                        ]
                    },
                    ...allTraits
                ]
            },

            init() {
                const classes = this.getClasses();
                if (this.get("tagName") === "ol") {
                    this.set("listStyle", "ol");
                } else if (classes.includes("list-inline")) {
                    this.set("listStyle", "list-inline");
                } else if (classes.includes("list-unstyled")) {
                    this.set("listStyle", "list-unstyled");
                } else {
                    this.set("listStyle", "ul");
                }
            },

            updated(property, value) {
                if (property !== "listStyle") return;

                const items = this.components();
                this.removeClass("list-inline");
                this.removeClass("list-unstyled");
                items.forEach((li) => li.removeClass("list-inline-item"));
                switch (value) {
                case "ol":
                    this.set("tagName", "ol");
                    break;

                case "ul":
                    this.set("tagName", "ul");
                    break;

                case "list-unstyled":
                    this.set("tagName", "ul");
                    this.addClass("list-unstyled");
                    break;

                case "list-inline":
                    this.set("tagName", "ul");
                    this.addClass("list-inline");
                    items.forEach((li) => {
                        if (li.get("tagName") === "li") {
                            li.addClass("list-inline-item");
                        }
                    });
                    break;
                }
            }
        }
    });

    editorTypes.addType("div", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "DIV",
        model: {
            defaults: {
                tagName: "div",
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });

    editor.DomComponents.addType("alert", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if(
                el.tagName === "DIV" &&
                el.classList?.contains("alert")
            )return { type: "alert" };
        },

        model: {
            defaults: {
                tagName: "div",
                editable: true,
                attributes: {
                    class: "alert alert-success",
                    role: "alert"
                },
                components: [
                    {
                        type: "span",
                        content: "",
                        components: [
                            {
                                type: "bold",
                                content: "Alert"
                            },
                            {
                                type: "textnode",
                                content: " text."
                            }
                        ]
                    }
                ],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "alertStyle",
                        label: "Style",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "success", label: "Success", value: "alert-success" },
                            { id: "info", label: "Info", value: "alert-info" },
                            { id: "warning", label: "Warning", value: "alert-warning" },
                            { id: "danger", label: "Danger", value: "alert-danger" },
                            { id: "primary", label: "Primary", value: "alert-primary" },
                            { id: "secondary", label: "Secondary", value: "alert-secondary" },
                            { id: "light", label: "Light", value: "alert-light" },
                            { id: "dark", label: "Dark", value: "alert-dark" },
                            { id: "none", label: "None", value: "" }
                        ]
                    },
                    {
                        type: "checkbox",
                        name: "alertDismissible",
                        label: "Dismissible",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    ...allTraits
                ]
            },

            init() {
                const classes = this.getClasses();
                const alertClass = classes.find((cls) =>
                    cls.startsWith("alert-") && cls !== "alert-dismissible"
                );
                this.set("alertStyle", alertClass || "");
                this.set("alertDismissible", classes.includes("alert-dismissible"));
            },

            updated(property, value) {
                if (property === "alertStyle") {
                    const classes = this.getClasses();
                    classes
                        .filter((cls) =>
                            cls.startsWith("alert-") && cls !== "alert-dismissible"
                        )
                        .forEach((cls) => this.removeClass(cls));
                    if (value) {
                        this.addClass(value);
                    }
                }
                if (property === "alertDismissible") {
                    if (value) {
                        this.addClass("alert-dismissible");
                    } else {
                        this.removeClass("alert-dismissible");
                    }
                }
            }
        }
    });

    editorTypes.addType("button", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (el.tagName === "BUTTON") return { type: "button" };
            if (el.tagName === "A" && el.classList?.contains("btn")) return { type: "button" };
            return false;
        },
        model: {
            defaults: {
                tagName: "button",
                classes: ["btn", "btn-primary"],
                attributes: { type: "button" },
                content: "Button",
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "buttonElement",
                        label: "Element",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "button", label: "Button", value: "button" },
                            { id: "link", label: "Link", value: "link" }
                        ]
                    },
                    {
                        type: "select",
                        name: "buttonType",
                        label: "Type",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "button", label: "Button", value: "button" },
                            { id: "submit", label: "Submit", value: "submit" },
                            { id: "reset", label: "Reset", value: "reset" }
                        ]
                    },
                    {
                        type: "select",
                        name: "buttonStyle",
                        label: "Style",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "primary", label: "Primary", value: "btn-primary" },
                            { id: "secondary", label: "Secondary", value: "btn-secondary" },
                            { id: "success", label: "Success", value: "btn-success" },
                            { id: "info", label: "Info", value: "btn-info" },
                            { id: "warning", label: "Warning", value: "btn-warning" },
                            { id: "danger", label: "Danger", value: "btn-danger" },
                            { id: "light", label: "Light", value: "btn-light" },
                            { id: "dark", label: "Dark", value: "btn-dark" },
                            { id: "link", label: "Link", value: "btn-link" },
                            { id: "none", label: "None", value: "" }
                        ]
                    },
                    {
                        type: "select",
                        name: "buttonSize",
                        label: "Size",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "large", label: "Large", value: "btn-lg" },
                            { id: "small", label: "Small", value: "btn-sm" }
                        ]
                    },
                    {
                        type: "checkbox",
                        name: "buttonOutline",
                        label: "Outlined",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    {
                        type: "checkbox",
                        name: "buttonDisabled",
                        label: "Disabled",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    {
                        type: "checkbox",
                        name: "buttonActive",
                        label: "Active",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    {
                        type: "text",
                        name: "buttonHref",
                        label: "Href",
                        category: GeneralCategory,
                        changeProp: 1,
                        placeholder: "https://..."
                    },
                    ...allTraits
                ]
            },

            init() {
                const classes = this.getClasses();
                const attrs = this.getAttributes();
                const styleRegex = /^btn-(?:outline-)?(primary|secondary|success|info|warning|danger|light|dark|link)$/;
                const styleClass = classes.find((cls) => styleRegex.test(cls)) || "";
                const colorMatch = styleClass.match(styleRegex);
                const isLink = this.get("tagName") === "a";
                this.set("buttonElement", isLink ? "link" : "button", { silent: true });
                this.set("buttonType", attrs.type || "button", { silent: true });
                this.set("buttonStyle", colorMatch ? `btn-${colorMatch[1]}` : "", { silent: true });
                this.set("buttonOutline", styleClass.startsWith("btn-outline-"), { silent: true });
                this.set("buttonSize", classes.find((cls) => /^btn-(sm|lg)$/.test(cls)) || "", { silent: true });
                this.set("buttonDisabled", "disabled" in attrs, { silent: true });
                this.set("buttonActive", "active" in attrs, { silent: true });
                this.set("buttonHref", attrs.href || "", { silent: true });
            },

            resolveStyleClass() {
                const style = this.get("buttonStyle");
                if (!style) return "";
                return this.get("buttonOutline") ? style.replace(/^btn-/, "btn-outline-") : style;
            },

            updated(property, value) {
                if (property === "buttonElement" && value) {
                    this.set("tagName", value === "link" ? "a" : "button");
                } else if (property === "buttonHref") {
                    if (value) this.addAttributes({ href: value });
                    else this.removeAttributes("href");
                } else if (property === "buttonType") {
                    if (this.get("buttonElement") !== "link") {
                        this.addAttributes({ type: value });
                    }
                } else if (property === "buttonStyle" || property === "buttonOutline") {
                    const styleRegex = /^btn-(?:outline-)?(primary|secondary|success|info|warning|danger|light|dark|link)$/;
                    this.getClasses()
                        .filter((cls) => styleRegex.test(cls))
                        .forEach((cls) => this.removeClass(cls));
                    const cls = this.resolveStyleClass();
                    if (cls) this.addClass(cls);
                } else if (property === "buttonSize") {
                    this.getClasses()
                        .filter((cls) => /^btn-(sm|lg)$/.test(cls))
                        .forEach((cls) => this.removeClass(cls));
                    if (value) this.addClass(value);
                } else if (property === "buttonDisabled") {
                    if (value) this.addAttributes({ disabled: "" });
                    else this.removeAttributes("disabled");
                } else if (property === "buttonActive") {
                    if (value) this.addAttributes({ active: "" });
                    else this.removeAttributes("active");
                }
            }
        }
    });

    editorTypes.addType("section", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "SECTION",
        model: {
            defaults: {
                tagName: "section",
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });

    editorTypes.addType("image", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "IMG" ? { type: "image" } : false,
        model: {
            defaults: {
                tagName: "img",
                void: true,
                name: "Image",
                attributes: { src: "", alt: "" },
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "text",
                        name: "src",
                        label: "Source",
                        category: GeneralCategory,
                        placeholder: "https://..."
                    },
                    {
                        type: "text",
                        name: "alt",
                        label: "Alt",
                        category: GeneralCategory,
                        placeholder: "description"
                    },
                    ...allTraits
                ]
            }
        }
    });

    editorTypes.addType("link", {
        extend: "base-text-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (el.tagName === "A" && !el.classList?.contains("btn")) {
                return { type: "link" };
            }
            return false;
        },
        model: {
            defaults: {
                tagName: "a",
                content: "Link",
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "text",
                        name: "linkHref",
                        label: "Href",
                        category: GeneralCategory,
                        changeProp: 1,
                        placeholder: "https://..."
                    },
                    {
                        type: "select",
                        name: "linkTarget",
                        label: "Target",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "self", label: "Self", value: "_self" },
                            { id: "blank", label: "Blank (new tab)", value: "_blank" },
                            { id: "parent", label: "Parent", value: "_parent" },
                            { id: "top", label: "Top", value: "_top" }
                        ]
                    },
                    {
                        type: "select",
                        name: "linkRel",
                        label: "Relationship",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "alternate", label: "Alternate", value: "alternate" },
                            { id: "author", label: "Author", value: "author" },
                            { id: "bookmark", label: "Bookmark", value: "bookmark" },
                            { id: "external", label: "External", value: "external" },
                            { id: "help", label: "Help", value: "help" },
                            { id: "license", label: "License", value: "license" },
                            { id: "next", label: "Next", value: "next" },
                            { id: "nofollow", label: "No Follow", value: "nofollow" },
                            { id: "noopener", label: "No Opener", value: "noopener" },
                            { id: "noreferrer", label: "No Referrer", value: "noreferrer" },
                            { id: "prev", label: "Previous", value: "prev" },
                            { id: "search", label: "Search", value: "search" },
                            { id: "tag", label: "Tag", value: "tag" }
                        ]
                    },
                    {
                        type: "checkbox",
                        name: "linkStretched",
                        label: "Stretched",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    ...allTraits
                ]
            },

            init() {
                const attrs = this.getAttributes();
                this.set("linkHref", attrs.href || "", { silent: true });
                this.set("linkTarget", attrs.target || "", { silent: true });
                this.set("linkRel", attrs.rel || "", { silent: true });
                this.set("linkStretched", this.getClasses().includes("stretched-link"), { silent: true });
            },

            updated(property, value) {
                if (property === "linkHref") {
                    if (value) this.addAttributes({ href: value });
                    else this.removeAttributes("href");
                } else if (property === "linkTarget") {
                    if (value) this.addAttributes({ target: value });
                    else this.removeAttributes("target");
                } else if (property === "linkRel") {
                    if (value) this.addAttributes({ rel: value });
                    else this.removeAttributes("rel");
                } else if (property === "linkStretched") {
                    if (value) this.addClass("stretched-link");
                    else this.removeClass("stretched-link");
                }
            }
        }
    });

    editorTypes.addType("dropdown", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (el.tagName === "DIV" && el.classList?.contains("dropdown")) {
                return { type: "dropdown" };
            }
            return false;
        },
        model: {
            defaults: {
                tagName: "div",
                classes: ["dropdown"],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "checkbox",
                        name: "dropdownOpen",
                        label: "Open",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    ...allTraits
                ],
                components: [
                    {
                        type: "button",
                        classes: ["btn", "btn-primary", "dropdown-toggle"],
                        attributes: {
                            type: "button",
                            "data-bs-toggle": "dropdown",
                            "aria-expanded": "false"
                        },
                        content: "Dropdown"
                    },
                    {
                        type: "div",
                        tagName: "div",
                        classes: ["dropdown-menu"],
                        components: [
                            {
                                type: "link",
                                classes: ["dropdown-item"],
                                attributes: { href: "#" },
                                content: "First action"
                            },
                            {
                                type: "link",
                                classes: ["dropdown-item"],
                                attributes: { href: "#" },
                                content: "Second action"
                            },
                            {
                                type: "link",
                                classes: ["dropdown-item"],
                                attributes: { href: "#" },
                                content: "Third action"
                            }
                        ]
                    }
                ]
            },

            getMenu() {
                return this.components().find((c) => c.getClasses().includes("dropdown-menu"));
            },

            init() {
                const menu = this.getMenu();
                this.set("dropdownOpen", menu ? menu.getClasses().includes("show") : false, { silent: true });
            },

            updated(property, value) {
                if (property !== "dropdownOpen") return;
                const menu = this.getMenu();
                if (!menu) return;
                if (value) menu.addClass("show");
                else menu.removeClass("show");
            }
        }
    });

    editorTypes.addType("row", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if(
                el.tagName === "DIV" &&
                el.classList?.contains("row")
            )return { type: "row" };
        },
        model: {
            defaults: {
                name: "Row",
                tagName: "div",
                classes: ["row"],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "checkbox",
                        name: "gutters",
                        label: "Gutters",
                        category: GeneralCategory,
                        changeProp: 1
                    },
                    {
                        type: "select",
                        name: "gx",
                        label: "Gutter Size (x)",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "gx0", label: "0", value: "gx-0" },
                            { id: "gx1", label: "1", value: "gx-1" },
                            { id: "gx2", label: "2", value: "gx-2" },
                            { id: "gx3", label: "3", value: "gx-3" },
                            { id: "gx4", label: "4", value: "gx-4" },
                            { id: "gx5", label: "5", value: "gx-5" }
                        ]
                    },
                    {
                        type: "select",
                        name: "gy",
                        label: "Gutter Size (y)",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "gy0", label: "0", value: "gy-0" },
                            { id: "gy1", label: "1", value: "gy-1" },
                            { id: "gy2", label: "2", value: "gy-2" },
                            { id: "gy3", label: "3", value: "gy-3" },
                            { id: "gy4", label: "4", value: "gy-4" },
                            { id: "gy5", label: "5", value: "gy-5" }
                        ]
                    },
                    {
                        type: "select",
                        name: "perRow",
                        label: "Cols per Row",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "cols1", label: "1", value: "row-cols-1" },
                            { id: "cols2", label: "2", value: "row-cols-2" },
                            { id: "cols3", label: "3", value: "row-cols-3" },
                            { id: "cols4", label: "4", value: "row-cols-4" },
                            { id: "cols5", label: "5", value: "row-cols-5" }
                        ]
                    },
                    ...allTraits
                ]
            },
            init() {
                const classes = this.getClasses();
                const gutterX = classes.find((cls) => cls.startsWith("gx-"));
                const gutterY = classes.find((cls) => cls.startsWith("gy-"));
                const rowCols = classes.find((cls) => cls.startsWith("row-cols-"));
                this.set("gutters", classes.includes("g-0"), { silent: true });
                this.set("gx", gutterX || "", { silent: true });
                this.set("gy", gutterY || "", { silent: true });
                this.set("perRow", rowCols || "", { silent: true });
            },
            updated(property, value) {
                const classes = this.getClasses();
                const gutters = classes.filter((cls) => cls.startsWith("g-0"));
                const gutterX = classes.filter((cls) => cls.startsWith("gx-"));
                const gutterY = classes.filter((cls) => cls.startsWith("gy-"));
                const rowCols = classes.filter((cls) => cls.startsWith("row-cols-"));
                if (property === "gutters") {
                    if(value === true) {
                        gutters.forEach((cls) => this.removeClass(cls));
                    } else {
                        gutterX.forEach((cls) => this.removeClass(cls));
                        gutterY.forEach((cls) => this.removeClass(cls));
                        this.addClass("g-0");
                        this.set("gx", "");
                        this.set("gy", "");
                    }
                } else if (property === "gx") {
                    gutterX.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                } else if (property === "gy") {
                    gutterY.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                } else if (property === "perRow") {
                    rowCols.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                }
            }
        }
    });

    editorTypes.addType("column", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if(
                el.tagName === "DIV" &&
                el.classList?.contains("col")
            )return { type: "column" };
        },
        model: {
            defaults: {
                tagName: "div",
                classes: ["col"],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "width",
                        label: "Width",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "none", label: "None", value: "" },
                            { id: "auto", label: "Auto", value: "col-auto" },
                            { id: "expand", label: "Expand", value: "col" },
                            { id: "col1", label: "1", value: "col-1" },
                            { id: "col2", label: "2", value: "col-2" },
                            { id: "col3", label: "3", value: "col-3" },
                            { id: "col4", label: "4", value: "col-4" },
                            { id: "col5", label: "5", value: "col-5" },
                            { id: "col6", label: "6", value: "col-6" },
                            { id: "col7", label: "7", value: "col-7" },
                            { id: "col8", label: "8", value: "col-8" },
                            { id: "col9", label: "9", value: "col-9" },
                            { id: "col10", label: "10", value: "col-10" },
                            { id: "col11", label: "11", value: "col-11" },
                            { id: "col12", label: "12", value: "col-12" }

                        ]
                    },
                    {
                        type: "select",
                        name: "offset",
                        label: "Offset",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "none", label: "None", value: "" },
                            { id: "offset0", label: "0", value: "offset-0" },
                            { id: "offset1", label: "1", value: "offset-1" },
                            { id: "offset2", label: "2", value: "offset-2" },
                            { id: "offset3", label: "3", value: "offset-3" },
                            { id: "offset4", label: "4", value: "offset-4" },
                            { id: "offset5", label: "5", value: "offset-5" },
                            { id: "offset6", label: "6", value: "offset-6" },
                            { id: "offset7", label: "7", value: "offset-7" },
                            { id: "offset8", label: "8", value: "offset-8" },
                            { id: "offset9", label: "9", value: "offset-9" },
                            { id: "offset10", label: "10", value: "offset-10" },
                            { id: "offset11", label: "11", value: "offset-11" }

                        ]
                    },
                    {
                        type: "select",
                        name: "verticalAlign",
                        label: "Vertical Align",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "start", label: "Start", value: "align-self-start" },
                            { id: "end", label: "End", value: "align-self-end" },
                            { id: "center", label: "Center", value: "align-self-center" },
                            { id: "baseline", label: "Baseline", value: "align-self-baseline" },
                            { id: "stretch", label: "Stretch", value: "align-self-stretch" }
                        ]
                    },
                    {
                        type: "select",
                        name: "order",
                        label: "Order",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "first", label: "First", value: "order-first" },
                            { id: "last", label: "Last", value: "order-last" },
                            { id: "order1", label: "1", value: "order-1" },
                            { id: "order2", label: "2", value: "order-2" },
                            { id: "order3", label: "3", value: "order-3" },
                            { id: "order4", label: "4", value: "order-4" },
                            { id: "order5", label: "5", value: "order-5" }
                        ]
                    },
                    ...allTraits
                ]
            },
            init() {
                const classes = this.getClasses();
                this.set("width", classes.find((cls) => cls.startsWith("col")) || "", { silent: true });
                this.set("offset", classes.find((cls) => cls.startsWith("offset-")) || "", { silent: true });
                this.set("verticalAlign", classes.find((cls) => cls.startsWith("align-self-")) || "", { silent: true });
                this.set("order", classes.find((cls) => cls.startsWith("order-")) || "", { silent: true });
            },
            updated(property, value) {
                const classes = this.getClasses();
                if (property === "width") {
                    const width = classes.filter((cls) => cls.startsWith("col"));
                    width.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                } else if(property === "offset") {
                    const offset = classes.filter((cls) => cls.startsWith("offset-"));
                    offset.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                } else if(property === "verticalAlign") {
                    const align = classes.filter((cls) => cls.startsWith("align-self-"));
                    align.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                } else if(property === "order") {
                    const order = classes.filter((cls) => cls.startsWith("order-"));
                    order.forEach((cls) => this.removeClass(cls));
                    this.addClass(value);
                }
            }
        }
    });

    editorTypes.addType("container", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if(
                el.tagName === "DIV" &&
                el.classList?.contains("container")
            )return { type: "container" };
        },
        model: {
            defaults: {
                tagName: "div",
                classes: ["container"],
                importGeneration: [GuiCommonsImport],
                traits: [
                    {
                        type: "select",
                        name: "fullwidth",
                        label: "Full Width Until",
                        category: GeneralCategory,
                        changeProp: 1,
                        options: [
                            { id: "default", label: "Default", value: "" },
                            { id: "fluid", label: "Fluid", value: "container-fluid" },
                            { id: "sm", label: "SM", value: "container-sm" },
                            { id: "md", label: "MD", value: "container-md" },
                            { id: "lg", label: "LG", value: "container-lg" },
                            { id: "xl", label: "XL", value: "container-xl" },
                            { id: "xxl", label: "XXL", value: "container-xxl" }
                        ]
                    },
                    ...allTraits
                ]
            },

            init() {
                this.set("fullwidth", this.getClasses().find((cls) =>
                    cls.startsWith("container-")) || "", { silent: true });
            },

            updated(property, value) {
                if (property !== "fullwidth") return;
                this.getClasses()
                    .filter((cls) => cls.startsWith("container"))
                    .forEach((cls) => this.removeClass(cls));
                this.addClass(value || "container");
            }
        }
    });

    editorTypes.addType("customSection", {
        extend: "base-component",
        extendFn: ["init"],
        model: {
            defaults: {
                tagName: "section",
                components: [
                    { type: "heading", content: "This is a simple title" },
                    { type: "paragraph", content: "This is just a Lorem text: Lorem ipsum dolor sit amet" }
                ],
                importGeneration: [GuiCommonsImport],
                traits: allTraits
            }
        }
    });

    editorTypes.addType("textInput", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (
                el.tagName === "INPUT" &&
                (!el.getAttribute?.("type") ||
                    ["text", "email", "password", "number", "tel", "url", "search"]
                        .includes(el.getAttribute("type"))
                )
            ) {
                return { type: "textInput" };
            }
            return false;
        },
        model: {
            defaults: {
                tagName: "input",
                void: true,
                attributes: {
                    type: "text"
                },
                importGeneration: [GuiCommonsImport],
                traits: [
                    ...InputGeneralTraits,
                    ...InputValidationTraits,
                    ...allTraits
                ]
            },

            init() {
                initInputTraits(this);
            },

            updated(property, value) {
                updateInputTrait(this, property, value);
            }
        }
    });

    editorTypes.addType("textarea", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) =>
            el.tagName === "TEXTAREA" ? { type: "textarea" } : false,
        model: {
            defaults: {
                tagName: "textarea",
                importGeneration: [GuiCommonsImport],
                traits: [
                    ...InputGeneralTraits.filter((t: any) => t.name !== "type" && t.name !== "value"),
                    ...TextareaGeneralTraits,
                    ...InputValidationTraits,
                    ...TextareaInputTraits,
                    ...allTraits
                ]
            },

            init() {
                initInputTraits(this);
            },

            updated(property, value) {
                updateInputTrait(this, property, value);
            }
        }
    });

    editorTypes.addType("checkboxInput", {
        extend: "base-component",
        extendFn: ["init"],
        isComponent: (el) => {
            if (el.tagName === "INPUT" && el.getAttribute?.("type") === "checkbox") {
                return { type: "checkboxInput" };
            }
            return false;
        },
        model: {
            defaults: {
                tagName: "input",
                void: true,
                attributes: {
                    type: "checkbox"
                },
                importGeneration: [GuiCommonsImport],
                traits: [
                    ...CheckboxGeneralTraits,
                    ...allTraits
                ]
            },

            init() {
                initInputTraits(this);
            },

            updated(property, value) {
                updateInputTrait(this, property, value);
                if (property === "checked") {
                    const el = <HTMLInputElement>this.getEl();
                    if (el) el.checked = !!value;
                }
            }
        }
    });
}
