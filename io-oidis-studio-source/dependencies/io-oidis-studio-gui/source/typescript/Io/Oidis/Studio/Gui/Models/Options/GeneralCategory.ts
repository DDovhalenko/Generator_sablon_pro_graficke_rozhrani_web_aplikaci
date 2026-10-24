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

export const GeneralCategory = { id: "general", label: "General" };

// matches GrapesJS auto-generated ids (used to filter them out of save output and trait sync)
const AUTO_ID_PATTERN = /^[a-z0-9]{4,6}$/;

export const GeneralTraits = [
    {
        type: "text",
        name: "elementId",
        label: "ID",
        category: GeneralCategory,
        changeProp: 1,
        placeholder: "elementId"
    },
    {
        type: "text",
        name: "oidisBindName",
        label: "OIDIS Bind",
        category: GeneralCategory,
        changeProp: 1,
        placeholder: "variableName",
        traitType: "attribute"
    }
];
export const GuiCommonsImport = {
    className: "GuiCommons",
    path: "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/GuiCommons.js"
}
;
export const BaseComponentModel = {
    defaults: {
        importGeneration: [GuiCommonsImport],
        traits: []
    },

    init() {
        this.syncOidisBindFromAttributes();
        this.syncElementIdFromAttributes();
        this.setupImportVariantTrait();
        this.on("change:oidisBindName", this.updateOidisBind);
        this.on("change:elementId", this.updateElementId);
    },

    syncOidisBindFromAttributes() {
        const attr = this.getAttributes()["data-oidis-bind"];
        if (!attr) return;

        const match = attr.match(/\$\{this\.(.+?)\}/);
        if (match) {
            this.set("oidisBindName", match[1]);
        }
    },

    updateOidisBind() {
        const name = this.get("oidisBindName");

        if (!name) {
            this.removeAttributes("data-oidis-bind");
            return;
        }

        this.addAttributes({
            "data-oidis-bind": `\${this.${name}}`
        });
    },

    syncElementIdFromAttributes() {
        const currentId = this.getId ? this.getId() : this.getAttributes().id;
        if (currentId && !AUTO_ID_PATTERN.test(currentId)) {
            this.set("elementId", currentId, { silent: true });
        }
    },
    
    updateElementId() {
        const newId = (this.get("elementId") || "").trim();
        const oldId = this.getId();
        if (newId === oldId) return;

        if (!newId) {
            // user cleared the field — assign a fresh auto id; export strips short auto ids back out
            const autoId = Math.random().toString(36).slice(2, 7);
            this.setId(autoId);
            return;
        }
        this.setId(newId);
    },

    setupImportVariantTrait() {
        const options = this.get("importGeneration") || [];
        if (options.length <= 1) return;
        const currentValue = this.get("importVariant");
        if (this.getTrait("importVariant")) {
            this.removeTrait("importVariant");
        }
        this.addTrait({
            type: "select",
            name: "importVariant",
            label: "Import Variant",
            category: GeneralCategory,
            changeProp: 1,
            options: options.map((opt) => ({
                id: opt.className,
                label: opt.className,
                value: opt.className
            }))
        });
        if (currentValue && options.some((o) => o.className === currentValue)) {
            this.set("importVariant", currentValue);
        } else {
            this.set("importVariant", options[options.length - 1].className);
        }
    }
};
