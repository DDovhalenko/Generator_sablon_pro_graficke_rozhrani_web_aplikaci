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

export function registerTraits(editor) {
    editor.Traits.addType("responsive-select", {
        noLabel: true,
        templateInput: "",
        createInput({trait}) {
            const collapseId = trait.id.replace(/\s+/g, "-").toLowerCase() + "-collapse";
            const el = document.createElement("div");
            el.innerHTML =  `
                <div class="d-flex flex-column">
                    <div class="d-flex justify-content-start align-items-center" style="gap:5px;">
                        <div
                           class="gjs-label-wrp"
                           data-bs-toggle="collapse"
                           data-bs-target="#${collapseId}"
                           aria-expanded="false"
                           style="cursor:pointer; user-select:none;">
                          <div class="gjs-label d-flex align-items-center gap-1">
                            ${trait.attributes.label}
                            <i class="responsive-collapse-arrow gjs-caret-icon fa fa-caret-down"></i>
                          </div>
                        </div>
                        <div class="gjs-field-wrp gjs-field-wrp--select">
                            <div class="gjs-field gjs-field-select">
                                <select data-bp="${trait.attributes.bootstrapPrefix}">
                                    ${trait.attributes.options.map((opt) => `<option value="${opt.id}">${opt.label}</option>`).join("")}
                                </select>
                                <div class="gjs-sel-arrow">
                                    <div class="gjs-d-s-arrow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="collapse mt-2" id="${collapseId}">
                        <div class="collapse-body  d-flex flex-column" style="gap:5px;">
                            ${["sm", "md", "lg", "xl", "xxl"].map((bp) => `
                                <div class="d-flex justify-content-start align-items-center" style="gap:5px;">
                                    <div class="gjs-label-wrp" style="cursor:pointer;">
                                      <div class="gjs-label text-end">${bp}</div>
                                    </div>
                                    <div class="gjs-field-wrp gjs-field-wrp--select">
                                        <div class="gjs-field gjs-field-select">
                                            <select data-bp="${trait.attributes.bootstrapPrefix}${bp}-">
                                                ${trait.attributes.options.map((opt) => `<option value="${opt.id}">${opt.label}</option>`).join("")}
                                            </select>
                                            <div class="gjs-sel-arrow">
                                                <div class="gjs-d-s-arrow"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>  
            `;
            return el;
        },
        onEvent({ component, event, trait }) {
            const target = event.target;
            if (target.tagName !== "SELECT") return;

            const bp = target.dataset.bp;
            const val = target.value;
            trait.attributes.options.map((opt) => {
                if(opt.value !== "") {
                    component.removeClass(`${bp}${opt.value}`);
                }
            });
            if(val !== "default") {
                component.addClass(`${bp}${val}`);
            }
        },
        onUpdate({ elInput, component, trait }) {
            const prefixOptions = trait.attributes.options;
            const classes = component.getClasses();
            const selects = elInput.querySelectorAll("select");
            selects.forEach((select) => {
                const bp = select.dataset.bp;
                let valueToSet = "default";
                prefixOptions.forEach((opt) => {
                    const cls = `${bp}${opt.value}`;
                    if (classes.includes(cls)) {
                        valueToSet = opt.value;
                    }
                });
                select.value = valueToSet;
            });
        }
    });
}
