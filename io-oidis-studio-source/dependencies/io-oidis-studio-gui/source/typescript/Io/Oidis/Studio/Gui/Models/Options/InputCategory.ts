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

import { GeneralCategory } from "./GeneralCategory.js";

const InputCategory = { id: "input", label: "Input" };

export const InputGeneralTraits = [
    {
        type: "select",
        name: "type",
        label: "Type",
        category: GeneralCategory,
        options: [
            { id: "text",     label: "Text",     value: "text"     },
            { id: "email",    label: "Email",    value: "email"    },
            { id: "password", label: "Password", value: "password" },
            { id: "number",   label: "Number",   value: "number"   },
            { id: "tel",      label: "Tel",      value: "tel"      },
            { id: "url",      label: "URL",      value: "url"      },
            { id: "search",   label: "Search",   value: "search"   }
        ]
    },
    {
        type: "text",
        name: "name",
        label: "Name",
        category: GeneralCategory
    },
    {
        type: "text",
        name: "value",
        label: "Value",
        category: GeneralCategory
    },
    {
        type: "text",
        name: "placeholder",
        label: "Placeholder",
        category: GeneralCategory
    },
    {
        type: "select",
        name: "inputSize",
        label: "Size",
        category: GeneralCategory,
        changeProp: 1,
        options: [
            { id: "default", label: "Default", value: ""   },
            { id: "lg",      label: "Large",   value: "form-control-lg" },
            { id: "sm",      label: "Small",   value: "form-control-sm" }
        ]
    },
    {
        type: "checkbox",
        name: "readonly",
        label: "Read Only",
        category: GeneralCategory,
        changeProp: 1
    },
    {
        type: "checkbox",
        name: "disabled",
        label: "Disabled",
        category: GeneralCategory,
        changeProp: 1
    }
];

export const InputValidationTraits = [
    {
        type: "checkbox",
        name: "autofocus",
        label: "Autofocus",
        category: InputCategory,
        changeProp: 1
    },
    {
        type: "checkbox",
        name: "required",
        label: "Required",
        category: InputCategory,
        changeProp: 1
    },
    {
        type: "text",
        name: "minlength",
        label: "Min Length",
        category: InputCategory,
        changeProp: 1
    },
    {
        type: "text",
        name: "maxlength",
        label: "Max Length",
        category: InputCategory,
        changeProp: 1
    },
    {
        type: "text",
        name: "pattern",
        label: "Pattern",
        category: InputCategory,
        changeProp: 1
    },
    {
        type: "select",
        name: "autocomplete",
        label: "Autocomplete",
        category: InputCategory,
        changeProp: 1,
        options: [
            { id: "default",          label: "Default",          value: ""                 },
            { id: "off",              label: "Off",              value: "off"              },
            { id: "on",               label: "On",               value: "on"               }
        ]
    },
    {
        type: "select",
        name: "inputmode",
        label: "Input Mode",
        category: InputCategory,
        changeProp: 1,
        options: [
            { id: "default", label: "Default", value: ""        },
            { id: "verbatim",    label: "Verbatim",    value: "verbatim"    },
            { id: "latin",    label: "Latin",    value: "latin"    },
            { id: "latinName", label: "Latin Name", value: "latin-name" },
            { id: "latinProse", label: "Latin Prose", value: "latin-prose" },
            { id: "fullWidthLatin",     label: "Full Width Latin",     value: "full-width-latin"     },
            { id: "kana",  label: "Kana",  value: "kana"  },
            { id: "katakana",   label: "Katakana",   value: "katakana"   },
            { id: "numeric",     label: "Numeric",     value: "numeric"     },
            { id: "tel",     label: "Tel",     value: "tel"     },
            { id: "email",     label: "Email",     value: "email"     },
            { id: "url",     label: "URL",     value: "url"     }
        ]
    }
];

export function initInputTraits(component: any): void {
    const sizePrefix = "form-control";
    const attrs = component.getAttributes();
    const classes = component.getClasses();

    if (classes.includes(`${sizePrefix}-lg`)) {
        component.set("inputSize", `${sizePrefix}-lg`, { silent: true });
    } else if (classes.includes(`${sizePrefix}-sm`)) {
        component.set("inputSize", `${sizePrefix}-sm`, { silent: true });
    } else {
        component.set("inputSize", "", { silent: true });
    }

    ["autofocus", "required", "readonly", "disabled", "checked"].forEach((attr) => {
        component.set(attr, attr in attrs, { silent: true });
    });

    ["autocomplete", "inputmode", "minlength", "maxlength", "pattern"].forEach((attr) => {
        component.set(attr, attrs[attr] || "", { silent: true });
    });
}

export function updateInputTrait(component: any, property: string, value: any): boolean {
    const sizePrefix = "form-control";
    if (property === "inputSize") {
        component.removeClass(`${sizePrefix}-lg`);
        component.removeClass(`${sizePrefix}-sm`);
        if (value) component.addClass(value);
        return true;
    }

    const booleanAttrs = ["autofocus", "required", "readonly", "disabled", "checked"];
    if (booleanAttrs.includes(property)) {
        if (value) {
            component.addAttributes({ [property]: "" });
        } else {
            component.removeAttributes(property);
        }
        return true;
    }

    const selectAttrs = ["autocomplete", "inputmode"];
    if (selectAttrs.includes(property)) {
        if (value) {
            component.addAttributes({ [property]: value });
        } else {
            component.removeAttributes(property);
        }
        return true;
    }

    const textAttrs = ["minlength", "maxlength", "pattern"];
    if (textAttrs.includes(property)) {
        if (value) {
            component.addAttributes({ [property]: value });
        } else {
            component.removeAttributes(property);
        }
        return true;
    }

    return false;
}

const TextareaCategory = { id: "input", label: "Input" };
export const TextareaGeneralTraits = [
    {
        type: "number",
        name: "rows",
        label: "Rows",
        category: { id: "general", label: "General" }
    },
    {
        type: "number",
        name: "cols",
        label: "Cols",
        category: { id: "general", label: "General" }
    }
];

export const TextareaInputTraits = [
    {
        type: "select",
        name: "spellcheck",
        label: "Spellcheck",
        category: TextareaCategory,
        options: [
            { id: "default", label: "Default", value: ""      },
            { id: "true",    label: "True",    value: "true"  },
            { id: "false",   label: "False",   value: "false" }
        ]
    },
    {
        type: "select",
        name: "wrap",
        label: "Wrap Text",
        category: TextareaCategory,
        options: [
            { id: "default", label: "Default", value: ""     },
            { id: "soft",    label: "Soft",    value: "soft" },
            { id: "hard",    label: "Hard",    value: "hard" }
        ]
    }
];

export const CheckboxGeneralTraits = [
    {
        type: "text",
        name: "name",
        label: "Name",
        category: GeneralCategory
    },
    {
        type: "text",
        name: "value",
        label: "Value",
        category: GeneralCategory
    },
    {
        type: "checkbox",
        name: "checked",
        label: "Checked",
        category: GeneralCategory,
        changeProp: 1
    },
    {
        type: "checkbox",
        name: "disabled",
        label: "Disabled",
        category: GeneralCategory,
        changeProp: 1
    },
    {
        type: "checkbox",
        name: "required",
        label: "Required",
        category: GeneralCategory,
        changeProp: 1
    }
];
