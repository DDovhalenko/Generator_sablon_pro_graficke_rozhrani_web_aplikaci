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

import {
    IImportEntry,
    IVariableEntry
} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Interfaces/ILoadedFile.js";

export class FileParserMarked {

    /*
        Extracts the content between //generated blockName start and //generated blockName end.
        For the html block, also unwraps the return ` ... ` to get the raw HTML.
        in: content - full file content, blockName - name of the block to extract
        out: block content string, or null if the markers are not found

     */
    public static extractBlock(content: string, blockName: string): string | null {
        const escaped: string = blockName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex: RegExp = new RegExp(
            "\\/\\/\\s*generated\\s+" + escaped + "\\s+start([\\s\\S]*?)\\/\\/\\s*generated\\s+" + escaped + "\\s+end"
        );
        const match: RegExpMatchArray | null = content.match(regex);
        if (!match) {
            return null;
        }

        // for the html block, unwrap the return ` ... ` to get just the HTML
        if (blockName === "html") {
            const htmlMatch: RegExpMatchArray | null = match[1].match(/return[\s\S]*?`([\s\S]*?)`/);
            return htmlMatch ? htmlMatch[1] : null;
        }
        return match[1];
    }

    /*
        Parses import statements from a generated block.
        in: block - content between generated imports markers
        out: array of className - path pairs
     */
    public static parseImports(block: string): IImportEntry[] {
        const result: IImportEntry[] = [];
        const regex: RegExp = /import\s*\{\s*(\w+)\s*\}\s*from\s*["']([^"']+)["']/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(block)) !== null) {
            result.push({ className: match[1], path: match[2] });
        }
        return result;
    }

    /*
        Parses field declarations from a generated block.
        in: block - content between generated variables markers
        out: array of varName - className pairs
     */
    public static parseVariables(block: string): IVariableEntry[] {
        const result: IVariableEntry[] = [];
        const regex: RegExp = /(?:public|private|protected)\s+(?:readonly\s+)?(\w+)\s*:\s*(\w+)/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(block)) !== null) {
            result.push({ varName: match[1], className: match[2] });
        }
        return result;
    }

}
