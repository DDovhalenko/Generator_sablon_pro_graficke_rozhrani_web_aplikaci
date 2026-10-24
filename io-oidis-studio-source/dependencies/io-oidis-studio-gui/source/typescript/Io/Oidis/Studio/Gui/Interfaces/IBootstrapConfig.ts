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

export interface IBootstrapEntry {
    name: string[];
    className: string;
    path: string;
}

export interface IBootstrapConfig {
    components: IBootstrapEntry[];
}

// generated-code-start
export const IBootstrapEntry = globalThis.RegisterInterface(["name", "className", "path"]);
export const IBootstrapConfig = globalThis.RegisterInterface(["components"]);
// generated-code-end
