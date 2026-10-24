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

import { LogIt } from "@io-oidis-commons/Io/Oidis/Commons/Utils/LogIt.js";
import { FileParserUnmarked } from "./FileParserUnmarked.js";

export class FileWriterUnmarked {

    /*
        Replaces the template in innerHtml() with new HTML, wrapping the return statement with markers.
        in: content - full file content, newHtml - replacement HTML
        out: file content with updated innerHtml block and markers
     */
    public static patchHtml(content: string, newHtml: string): string {
        // locate the innerHtml method
        const methodMatch = content.match(/\binnerHtml\s*\(\s*\)\s*:\s*string\s*\{/);
        if (!methodMatch) {
            LogIt.Debug("Unmarked file has no innerhtml");
            return content;
        }
        const methodBodyStart = (methodMatch.index ?? 0) + methodMatch[0].length;

        // find the return ` statement inside the method body
        const afterMethod = content.substring(methodBodyStart);
        const returnMatch = afterMethod.match(/return\s*`/);
        if (!returnMatch) {
            LogIt.Debug("Unmarked file has no return");
            return content;
        }

        const returnKeywordPos = methodBodyStart + (returnMatch.index ?? 0);
        let templateStart    = returnKeywordPos + returnMatch[0].length;

        // scan to the closing backtick, skipping escaped ones
        while (templateStart < content.length) {
            if (content[templateStart] === "\\") {
                templateStart += 2;
                continue;
            }
            if (content[templateStart] === "`")  {
                break;
            }
            templateStart++;
        }
        if (templateStart >= content.length) return content;
        const closingBacktickPos = templateStart;

        // move past optional whitespace and semicolon to reach the end of the return line
        let afterReturn = closingBacktickPos + 1;
        while (afterReturn < content.length && (content[afterReturn] === " " || content[afterReturn] === "\t")) {
            afterReturn++;
        }
        if (afterReturn < content.length && content[afterReturn] === ";") {
            afterReturn++;
        }

        // detect indentation from the return line
        let lineStart = returnKeywordPos - 1;
        while (lineStart > 0 && content[lineStart] !== "\n") lineStart--;
        lineStart++;
        const indent = content.substring(lineStart, returnKeywordPos);

        // extend region start backward to include existing start marker if present
        let regionStart = lineStart;
        const beforeReturnLine = content.substring(0, lineStart);
        const startMarkerMatch = beforeReturnLine.match(/([ \t]*\/\/generated html start[ \t]*\r?\n)$/);
        if (startMarkerMatch) {
            regionStart = lineStart - startMarkerMatch[1].length;
        }

        // extend region end forward to include existing end marker if present
        let regionEnd         = afterReturn;
        const afterReturnLine  = content.substring(afterReturn);
        const endMarkerMatch   = afterReturnLine.match(/^\r?\n[ \t]*\/\/generated html end/);
        if (endMarkerMatch) {
            regionEnd = afterReturn + endMarkerMatch[0].length;
        }

        const trimmedHtml = newHtml.replace(/\n$/, "");

        // build the replacement with markers around the return statement
        const replacement =
            `${indent}//generated html start\n` +
            `${indent}return \`\n` +
            `${trimmedHtml}\n` +
            `${indent}\`;\n` +
            `${indent}//generated html end`;

        return content.substring(0, regionStart) + replacement + content.substring(regionEnd);
    }

    /*
        Updates declarations in the class body (only between class start and constructor).
        currentVars covers only vars from HTML block — other declarations in the class are never touched.
        Marked block exists - replace block content. No marked block - remove currentVars lines, create marked block at class start.
        in: content - full file, currentVars - HTML vars from imported file, variableCreationString - new declarations string
        out: file content with updated or created declarations block
     */
    public static patchVariables(
        content: string,
        currentVars: Array<{ varName: string; className: string }>,
        variableCreationString: string
    ): string {
        // find the region between class opening and constructor
        const classBodyStart = FileParserUnmarked.findClassBodyStart(content);
        if (classBodyStart === null) return content;

        const constructorMatch = content.match(/\bconstructor\s*\(/);
        if (!constructorMatch) return content;
        const constructorPos = (constructorMatch.index ?? 0);

        const constructorLineMatch = content.match(/^([ \t]*)constructor\b/m);
        const indent = constructorLineMatch?.[1] ?? "    ";

        let declRegion = content.substring(classBodyStart, constructorPos);

        const blockExists = declRegion.includes("//generated variables start");

        if (blockExists) {
            if (variableCreationString.trim().length > 0) {
                // replace existing block content with the new declarations
                declRegion = declRegion.replace(
                    /[ \t]*\/\/generated variables start[\s\S]*?\/\/generated variables end[ \t]*/,
                    `${indent}//generated variables start\n${variableCreationString}${indent}//generated variables end`
                );
            } else {
                // no declarations left — remove the empty block entirely
                declRegion = declRegion.replace(
                    /\n?[ \t]*\/\/generated variables start[\s\S]*?\/\/generated variables end[ \t]*\n?/,
                    ""
                );
            }
        } else {
            // clear out old declarations from HTML to avoid duplicates in the new block
            const currentVarNames = new Set(currentVars.map((v) => v.varName));
            declRegion = this.removeDeclLines(declRegion, currentVarNames);

            // prepend the new marked block at the top of the class body
            if (variableCreationString.trim().length > 0) {
                const block = `\n${indent}//generated variables start\n${variableCreationString}${indent}//generated variables end`;
                declRegion = block + declRegion;
            }
        }

        return content.substring(0, classBodyStart) + declRegion + content.substring(constructorPos);
    }

    /*
        Updates initialization lines in the constructor body.
        currentVars covers only vars from HTML block — other initializations in the constructor are never touched.
        Marked block exists - replace block content. No marked block - remove currentVars lines, create block after super().
        in: content - full file, currentVars - HTML vars from imported file, variableInitializationString - new init string
        out: file content with updated or created init block
     */
    public static patchInitializations(
        content: string,
        currentVars: Array<{ varName: string; className: string }>,
        variableInitializationString: string
    ): string {
        // find constructor body boundaries
        const range = FileParserUnmarked.findConstructorBodyRange(content);
        if (!range) return content;

        const superEnd = FileParserUnmarked.findSuperCallEnd(content, range.bodyStart);

        const constructorLineMatch = content.match(/^([ \t]*)constructor\b/m);
        const bodyIndent = (constructorLineMatch?.[1] ?? "    ") + "    ";

        let initRegion = content.substring(superEnd, range.bodyEnd);

        const blockExists = initRegion.includes("//generated inicialization start");

        if (blockExists) {
            if (variableInitializationString.trim().length > 0) {
                // replace existing block content with new initializations
                initRegion = initRegion.replace(
                    /[ \t]*\/\/generated inicialization start[\s\S]*?\/\/generated inicialization end[ \t]*/,
                    `${bodyIndent}//generated inicialization start\n${variableInitializationString}${bodyIndent}//generated inicialization end`
                );
            } else {
                // no initializations left — remove the empty block entirely
                initRegion = initRegion.replace(
                    /\n?[ \t]*\/\/generated inicialization start[\s\S]*?\/\/generated inicialization end[ \t]*\n?/,
                    ""
                );
            }
        } else {
            // clear old init lines for variables from HTML to avoid duplicates in the new block
            const currentVarNames = new Set(currentVars.map((v) => v.varName));
            initRegion = this.removeInitLines(initRegion, currentVarNames);

            if (variableInitializationString.trim().length > 0) {
                // prepend the new marked block right after super()
                const block = `\n${bodyIndent}//generated inicialization start\n${variableInitializationString}${bodyIndent}//generated inicialization end`;
                initRegion = block + initRegion;
            }
        }

        return content.substring(0, superEnd) + initRegion + content.substring(range.bodyEnd);
    }

    /*
        Builds a complete TS file from scratch with all four generated blocks pre-populated.
        Used when saving an empty file for the first time.
        in: importString - imports,
            variableCreationString - declarations,
            variableInitializationString - inits,
            html - HTML content
        out: complete TS file content as a string
     */
    public static buildTemplate(importString: string, variableCreationString: string,
                                variableInitializationString: string, html: string): string {
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

export class NewComponent extends BasePanel {
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
        Updates import statements, keeping non-generated imports intact.
        currentVars provides class names to identify which imports are HTML-managed.
        Block exists → replace block content. No block → remove currentVars class imports, create block after last existing import.
        in: content - full file, currentVars - HTML vars from file load, importString - new imports string
        out: file content with updated or created imports block
     */
    public static patchImports(
        content: string,
        currentVars: Array<{ varName: string; className: string }>,
        importString: string
    ): string {
        const blockExists = content.includes("//generated imports start");

        if (blockExists) {
            if (importString.trim().length > 0) {
                // replace existing block content with new imports
                content = content.replace(
                    /[ \t]*\/\/generated imports start[\s\S]*?\/\/generated imports end[ \t]*/,
                    `//generated imports start\n${importString}//generated imports end`
                );
            } else {
                // no imports left — remove the empty block entirely
                content = content.replace(
                    /\n?[ \t]*\/\/generated imports start[\s\S]*?\/\/generated imports end[ \t]*\n?/,
                    ""
                );
            }
        } else {
            // remove existing import lines for HTML-managed classes to avoid duplicates
            const classNames = new Set(currentVars.map((v) => v.className));
            content = this.removeImportLines(content, classNames);

            if (importString.trim().length > 0) {
                const importMatches = [...content.matchAll(/^import\s+.+$/gm)];
                const lastImport = importMatches.at(-1);
                if (lastImport) {
                    // insert the new block right after the last existing import
                    const insertPos = (lastImport.index ?? 0) + lastImport[0].length;
                    const block = `\n//generated imports start\n${importString}//generated imports end`;
                    content = content.substring(0, insertPos) + block + content.substring(insertPos);
                } else {
                    // no imports at all — place the block before the class declaration
                    const classMatch = content.match(/^export\s+class\b/m);
                    if (classMatch) {
                        const block = `//generated imports start\n${importString}//generated imports end\n`;
                        content = content.substring(0, (classMatch.index ?? 0)) + block + content.substring((classMatch.index ?? 0));
                    }
                }
            }
        }

        return content;
    }

    /*
        Removes import statements for the given class names from the file.
        Handles single-class imports only — import { X } from "...".
        in: content - full file content, classNames - class names to remove
        out: file content without those import lines
     */
    private static removeImportLines(content: string, classNames: Set<string>): string {
        return content.split("\n").filter((line) => {
            for (const className of classNames) {
                if (new RegExp(`import\\s*\\{\\s*${className}\\s*\\}\\s*from`).test(line)) {
                    return false;
                }
            }
            return true;
        }).join("\n");
    }

    /*
        Removes field declaration lines for the given variable names from a class body region.
        Matches access-modifier declarations — public/private/protected (readonly) varName : Type.
        in: region - class body before constructor, varNames - variable names to remove
        out: region without those declaration lines
     */
    private static removeDeclLines(region: string, varNames: Set<string>): string {
        return region.split("\n").filter((line) => {
            for (const varName of varNames) {
                if (new RegExp(`(?:public|private|protected)\\s+(?:readonly\\s+)?\\b${varName}\\b\\s*:`).test(line)) {
                    return false;
                }
            }
            return true;
        }).join("\n");
    }

    /*
        Removes constructor initialization lines for the given variable names from a constructor region.
        Matches lines of the form: this.varName = ...
        in: region - constructor body region, varNames - variable names to remove
        out: region without those initialization lines
     */
    private static removeInitLines(region: string, varNames: Set<string>): string {
        return region.split("\n").filter((line) => {
            for (const varName of varNames) {
                if (new RegExp(`\\bthis\\.${varName}\\s*=`).test(line)) {
                    return false;
                }
            }
            return true;
        }).join("\n");
    }

}
