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

export class FileWriterMarked {

    /*
         Replaces all four generated blocks in an existing marked file with new content.
        in: content - full file content,
            importString - new imports,
            variableCreationString - new declarations,
            variableInitializationString - new inits,
            html - new HTML content
        out: file content with all four blocks updated
     */
    public static replaceBlocks(content: string, importString: string, variableCreationString: string,
                                variableInitializationString: string, html: string): string {
        content = content.replace(
            /(\/\/generated imports start)[\s\S]*?(\/\/generated imports end)/,
            `$1\n${importString}$2`
        );
        content = content.replace(
            /(\/\/generated variables start)[\s\S]*?(\/\/generated variables end)/,
            `$1\n${variableCreationString}    $2`
        );
        content = content.replace(
            /(\/\/generated inicialization start)[\s\S]*?(\/\/generated inicialization end)/,
            `$1\n${variableInitializationString}        $2`
        );
        const htmlContent =
`        return \`
${html}
        \`;`;
        content = content.replace(
            /(\/\/generated html start)[\s\S]*?(\/\/generated html end)/,
            `$1\n${htmlContent}\n        $2`
        );
        return content;
    }

    /*
         Builds a complete TS file from scratch with all four generated blocks pre-populated.
        in: importString - imports, variableCreationString - declarations,
            variableInitializationString - inits, html - HTML content
        out: complete TS file content as a string
     */
    public static buildTemplate(importString: string, variableCreationString: string,
                                variableInitializationString: string, html: string): string {
        return `
/*! ******************************************************************************************************** *
*
* Copyright 2025 Oidis
*
* SPDX-License-Identifier: BSD-3-Clause
* The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
* or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
*
 * ********************************************************************************************************* */
//generated imports start
import { BasePanel } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/BasePanel.js";
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

}
