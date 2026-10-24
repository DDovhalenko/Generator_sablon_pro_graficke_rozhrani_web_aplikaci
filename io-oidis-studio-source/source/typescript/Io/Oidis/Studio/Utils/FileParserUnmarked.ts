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

export class FileParserUnmarked {

    /*
        Parses all import statements from the file content.
        Handles single-class imports only — import { X } from "...".
        in: content - full file content
        out: array of className - path pairs for every found import
     */
    public static parseAllImports(content: string): Array<{ className: string; path: string }> {
        const result: Array<{ className: string; path: string }> = [];
        const regex = /import\s*\{\s*(\w+)\s*\}\s*from\s*["']([^"']+)["']/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(content)) !== null) {
            result.push({ className: match[1], path: match[2] });
        }
        return result;
    }

    /*
        Parses all field declarations from the file content.
        Handles public/private/protected with or without readonly.
        in: content - full file content
        out: array of varName - className pairs for every found declaration
     */
    public static parseClassFieldDeclarations(content: string): Array<{ varName: string; className: string }> {
        const result: Array<{ varName: string; className: string }> = [];
        const regex = /(?:public|private|protected)\s+(?:readonly\s+)?(\w+)\s*:\s*(\w+)/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(content)) !== null) {
            result.push({ varName: match[1], className: match[2] });
        }
        return result;
    }

    /*
        Extracts the HTML content from the template inside innerHtml().
        Works on files without generated markers — finds the method by name, not by structure.
        in: content - full file content
        out: raw HTML string between the backticks, or null if the method or return is not found
     */
    public static extractInnerHtmlReturn(content: string): string | null {
        // locate the innerHtml method
        const methodMatch = content.match(/\binnerHtml\s*\(\s*\)\s*:\s*string\s*\{/);
        if (!methodMatch) return null;

        const methodBodyStart = (methodMatch.index ?? 0) + methodMatch[0].length;

        // find the return ` statement — may appear after local variable declarations
        const afterMethod = content.substring(methodBodyStart);
        const returnMatch = afterMethod.match(/return\s*`/);
        if (!returnMatch) return null;

        const templateStart = methodBodyStart + (returnMatch.index ?? 0) + returnMatch[0].length;

        // scan character by character to the closing backtick, skipping escaped ones
        let i = templateStart;
        while (i < content.length) {
            if (content[i] === "\\") {
                i += 2;
                continue;
            }
            if (content[i] === "`")  {
                return content.substring(templateStart, i);
            }
            i++;
        }

        return null;
    }

    /*
        Returns the position right after the opening { of the class body.
        Assumes no { appears in the class signature — safe for Oidis panel classes without generic constraints.
        in: content - full file content
        out: index of the first character inside the class body, or null if class not found
     */
    public static findClassBodyStart(content: string): number | null {
        const classMatch = content.match(/\bclass\b[^{]*/);
        if (!classMatch) return null;
        const bracePos = (classMatch.index ?? 0) + classMatch[0].length;
        return content[bracePos] === "{" ? bracePos + 1 : null;
    }

    /*
        Finds the constructor body boundaries using brace depth tracking.
        in: content - full file content
        out: bodyStart - index right after opening {, bodyEnd - index of closing }
     */
    public static findConstructorBodyRange(content: string): { bodyStart: number; bodyEnd: number } | null {
        const constructorMatch = content.match(/\bconstructor\s*\([^)]*\)\s*\{/);
        if (!constructorMatch) return null;
        const bodyStart = (constructorMatch.index ?? 0) + constructorMatch[0].length;

        // track brace depth to find the matching closing brace
        let depth = 1;
        let i     = bodyStart;
        while (i < content.length && depth > 0) {
            if (content[i] === "{") depth++;
            else if (content[i] === "}") depth--;
            i++;
        }
        return depth === 0 ? { bodyStart, bodyEnd: i - 1 } : null;
    }

    /*
        Returns the position right after the super() call line in the constructor body.
        Falls back to the start of the constructor body if super() is not found.
        in: content - full file content, constructorBodyStart - index right after constructor {
        out: index of the first character on the line after super()
     */
    public static findSuperCallEnd(content: string, constructorBodyStart: number): number {
        const afterBody  = content.substring(constructorBodyStart);
        const superMatch = afterBody.match(/super\s*\([^)]*\)\s*;?[ \t]*(?:\r?\n)?/);
        if (!superMatch) return constructorBodyStart;
        return constructorBodyStart + (superMatch.index ?? 0) + superMatch[0].length;
    }

}
