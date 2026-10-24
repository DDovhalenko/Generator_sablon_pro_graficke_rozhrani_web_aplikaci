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

export interface IImportEntry {
    className: string;
    path: string;
}

export interface IVariableEntry {
    varName: string;
    className: string;
}

export interface ILoadedFile {
    html: string | null;
    imports: IImportEntry[];
    variables: IVariableEntry[];
    hasMarkers: boolean;
}

// generated-code-start
export const IImportEntry = globalThis.RegisterInterface(["className", "path"]);
export const IVariableEntry = globalThis.RegisterInterface(["varName", "className"]);
export const ILoadedFile = globalThis.RegisterInterface(["html", "imports", "variables", "hasMarkers"]);
// generated-code-end
