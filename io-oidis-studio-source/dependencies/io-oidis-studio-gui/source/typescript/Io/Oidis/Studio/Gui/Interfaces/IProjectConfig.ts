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

export interface IProjectEntry {
    name: string;
    label?: string;
    className: string;
    path: string;
    category?: string;
    htmlPattern: string;
}

export interface IProjectConfig {
    components: IProjectEntry[];
}

// generated-code-start
export const IProjectEntry = globalThis.RegisterInterface(["name", "label", "className", "path", "category", "htmlPattern"]);
export const IProjectConfig = globalThis.RegisterInterface(["components"]);
// generated-code-end
