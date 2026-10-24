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

export function buildTraitsFromOptions(options: any[]) {
    return options.map((opt) => {
        return {
            type: opt.responsive ? "responsive-select" : "select",
            name: opt.property.label,
            bootstrapPrefix: opt.property.bootstrapPrefix,
            label: opt.property.label,
            category: opt.category,
            changeProp: 1,
            traitType: "bootstrap",
            options: opt.options.map((o) => ({
                id: o.value || "default",
                label: o.label,
                value: o.value
            }))
        };
    });
}
