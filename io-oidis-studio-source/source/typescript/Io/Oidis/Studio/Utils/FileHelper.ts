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

import { BaseConnector } from "@io-oidis-localhost/Io/Oidis/Localhost/Primitives/BaseConnector.js";
import { Extern } from "@io-oidis-localhost/Io/Oidis/Localhost/Primitives/Decorators.js";
import { FileSystemHandler } from "@io-oidis-localhost/Io/Oidis/Localhost/Connectors/FileSystemHandler.js";
import { LogIt } from "@io-oidis-commons/Io/Oidis/Commons/Utils/LogIt.js";
import { FileParserUnmarked } from "./FileParserUnmarked.js";
import { FileParserMarked } from "./FileParserMarked.js";
import { FileWriterUnmarked } from "./FileWriterUnmarked.js";
import { IBootstrapConfig } from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Interfaces/IBootstrapConfig.js";
import { IProjectConfig } from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Interfaces/IProjectConfig.js";
import {
    ILoadedFile,
    IVariableEntry
} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Interfaces/ILoadedFile.js";

export class FileHelper extends BaseConnector {
    private fsh: FileSystemHandler;

    constructor() {
        super();
        this.fsh = new FileSystemHandler();
    }

    /*
        Saves editor output into a fully marked TS file by replacing each generated block.
        Empty file - generates a complete template from scratch instead.
        in: encodedPath - URL-encoded file path,
            importString - new imports,
            variableCreationString - new declarations,
            variableInitializationString - new inits,
            html - new HTML content
     */
    @Extern()
    public saveFile(encodedPath: string, importString: string, variableCreationString: string,
                    variableInitializationString: string, html: string) {
        const normalizedPath = this.fsh.NormalizePath(decodeURIComponent(encodedPath));
        if (!this.fsh.Exists(normalizedPath)) {
            LogIt.Debug("File does not exist: " + normalizedPath);
            return;
        }

        // replace each of the four generated blocks in the existing file
        let content = this.fsh.Read(normalizedPath).toString();
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
        this.fsh.Write(normalizedPath, content);
        LogIt.Debug("File updated:", normalizedPath);
    }

    /*
        Saves editor output into a file that has no generated markers yet.
        in: encodedPath - URL-encoded file path,
            currentVars - HTML vars from the imported file,
            importString - new imports,
            variableCreationString - new declarations,
            variableInitializationString - new inits,
            html - new HTML content
     */
    @Extern()
    public saveFileUnmarked(encodedPath: string, currentVars: IVariableEntry[], importString: string,
                            variableCreationString: string, variableInitializationString: string, html: string): void {
        const normalizedPath = this.fsh.NormalizePath(decodeURIComponent(encodedPath));
        if (!this.fsh.Exists(normalizedPath)) {
            LogIt.Debug("File does not exist: " + normalizedPath);
            return;
        }
        let content = this.fsh.Read(normalizedPath).toString();
        // empty file — generate a full template instead of patching
        if (this.fsh.IsEmpty(normalizedPath)) {
            const content = FileWriterUnmarked.buildTemplate(importString, variableCreationString, variableInitializationString, html);
            this.fsh.Write(normalizedPath, content);
            LogIt.Debug("File was empty, generated full file:", normalizedPath);
            return;
        }
        content = FileWriterUnmarked.patchImports(content, currentVars, importString);
        content = FileWriterUnmarked.patchVariables(content, currentVars, variableCreationString);
        content = FileWriterUnmarked.patchInitializations(content, currentVars, variableInitializationString);
        content = FileWriterUnmarked.patchHtml(content, html);
        this.fsh.Write(normalizedPath, content);
        LogIt.Debug("Unmarked file patched (imports + variables + init + html):", normalizedPath);
    }

    /*
        Reads a TS file and extracts its HTML, imports and variables.
        Falls back to whole-file parsing when generated markers are missing.
        in: encodedPath - URL-encoded file path
        out: parsed file data, or null if file not found
     */
    @Extern()
    public loadFileByPath(encodedPath: string): ILoadedFile | null {
        const normalizedPath = this.fsh.NormalizePath(decodeURIComponent(encodedPath));
        if (!this.fsh.Exists(normalizedPath)) {
            LogIt.Debug("File does not exist: " + normalizedPath);
            return null;
        }
        const content: string = this.fsh.Read(normalizedPath).toString();

        if (this.fsh.IsEmpty(normalizedPath)) {
            return {
                html:      "",
                imports:   null,
                variables: null,
                hasMarkers: false
            };
        }

        // try to extract each of the four generated blocks
        const importsBlock: string | null   = FileParserMarked.extractBlock(content, "imports");
        const variablesBlock: string | null = FileParserMarked.extractBlock(content, "variables");
        const htmlBlock: string | null      = FileParserMarked.extractBlock(content, "html");
        const initBlock: string | null      = FileParserMarked.extractBlock(content, "inicialization");

        const hasMarkers: boolean =
            importsBlock !== null &&
            variablesBlock !== null &&
            htmlBlock !== null &&
            initBlock !== null;

        // fall back to whole-file extraction when markers are missing
        const resolvedHtml: string | null = htmlBlock ?? FileParserUnmarked.extractInnerHtmlReturn(content);
        if (!hasMarkers) {
            LogIt.Debug("File has no generated markers, using fallback extraction");
        }
        return {
            html:      resolvedHtml,
            imports:   importsBlock   ? FileParserMarked.parseImports(importsBlock)     : FileParserUnmarked.parseAllImports(content),
            variables: variablesBlock ? FileParserMarked.parseVariables(variablesBlock) :
                FileParserUnmarked.parseClassFieldDeclarations(content),
            hasMarkers
        };
    }

    /*
        Reads a resource file from the opened project's GUI dependency and returns it as a base64 data URL.
        Used by the frontend to display images whose src is a relative /resource/... path.
        in: encodedGuiRoot - URL-encoded absolute path to the GUI project root
                             (workingDir + the path segment before /source/ in the opened file),
            resourcePath - relative path starting with /resource/...
        out: data:mime;base64,... string, or null if the file does not exist
     */
    @Extern()
    public getResourceAsDataUrl(encodedGuiRoot: string, resourcePath: string): string | null {
        const guiRoot  = this.fsh.NormalizePath(decodeURIComponent(encodedGuiRoot));
        const fullPath = this.fsh.NormalizePath(guiRoot + "/" + resourcePath.replace(/^\//, ""));
        if (!this.fsh.Exists(fullPath)) {
            LogIt.Debug("Resource not found:", fullPath);
            return null;
        }
        const data   = this.fsh.Read(fullPath);
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(<string>data);
        return `data:${this.getMimeType(fullPath)};base64,${buffer.toString("base64")}`;
    }

    /*
        Resolves MIME type from file extension for common image formats.
        in: filePath - path with extension
        out: MIME type string
     */
    private getMimeType(filePath: string): string {
        const ext = filePath.toLowerCase().split(".").pop();
        const mimes: { [key: string]: string } = {
            svg: "image/svg+xml", png: "image/png",
            jpg: "image/jpeg",    jpeg: "image/jpeg",
            gif: "image/gif",     webp: "image/webp",
            ico: "image/x-icon"
        };
        return mimes[ext] ?? "application/octet-stream";
    }

    /*
        Loads BootstrapConfig and ProjectConfig for the given working directory.
        in: encodedWorkingDir - URL-encoded project root path
        out: both config objects (either can be null if the file is missing)
     */
    @Extern()
    public getBootstrapConfigFile(encodedWorkingDir: string): {
        bootstrapConfig: IBootstrapConfig | null,
        projectConfig: IProjectConfig | null
    } | null {
        const projectRoot: string = this.fsh.NormalizePath(decodeURIComponent(encodedWorkingDir));
        if (!projectRoot) {
            LogIt.Debug("Working directory not provided");
            return;
        }
        return {
            bootstrapConfig: this.loadBootstrapConfig(projectRoot),
            projectConfig:   this.loadProjectConfig(projectRoot)
        };
    }

    /*
        Loads BootstrapConfig.json from the usercontrols dependency inside the project root.
        in: projectRoot - absolute path to the project root
        out: parsed config, or null if the file is missing
     */
    private loadBootstrapConfig(projectRoot: string): IBootstrapConfig | null {
        const bootstrapPath: string = this.fsh.NormalizePath(
            projectRoot + "/dependencies/io-oidis-usercontrols/bin/project/configs/BootstrapConfig.json"
        );
        return this.readJsonIfExists<IBootstrapConfig>(bootstrapPath);
    }

    /*
        Loads ProjectConfig.json from the standard location inside the project root.
        in: projectRoot - absolute path to the project root
        out: parsed config, or null if the file is missing
     */
    private loadProjectConfig(projectRoot: string): IProjectConfig | null {
        const projectConfigPath: string = this.fsh.NormalizePath(
            projectRoot + "/bin/project/configs/ProjectConfig.json"
        );
        return this.readJsonIfExists<IProjectConfig>(projectConfigPath);
    }

    /*
        Reads and parses a JSON file.
        in: path - absolute file path
        out: parsed object, or null if missing
     */
    private readJsonIfExists<T>(path: string): T | null {
        if (!this.fsh.Exists(path)) {
            return null;
        }
        try {
            return JSON.parse(this.fsh.Read(path).toString());
        } catch (e) {
            throw new Error("Invalid JSON at: " + path);
        }
    }

}
