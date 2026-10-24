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

import { BasePanel } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/BasePanel.js";
import { Button } from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Button.js";
import { TextField } from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/TextField.js";
import { Label } from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Label.js";

export class PathInputDialog extends BasePanel {

    public readonly confirmButton    : Button;
    public readonly pathInput        : TextField;
    public readonly workingDirInput  : TextField;
    public readonly relativePathInput: TextField;
    public readonly pathError        : Label;

    constructor() {
        super();
        this.confirmButton     = new Button();
        this.pathInput         = new TextField();
        this.workingDirInput   = new TextField();
        this.relativePathInput = new TextField();
        this.pathError         = new Label();
    }

    public setup(onConfirm: (workingDir: string, relativePath: string) => void, onClose?: () => void) : void {
        this.setPathError(null);

        const confirm = () => {
            this.autoFillWorkingDir();
            const workingDir   = this.getWorkingDir();
            const relativePath = this.getRelativePath();
            if (!workingDir || !relativePath) return;
            onConfirm(workingDir, relativePath);
        };

        const close = () => {
            if (onClose && this.Visible()) onClose();
        };

        this.pathInput.getEvents().setEvent("oninput", () => {
            this.pathInput.getEvents().FireAsynchronousMethod(
                () => this.autoFillWorkingDir(), true, 400
            );
        });

        this.pathInput.getEvents().setEvent("onkeydown", (e : any) => {
            if ((<KeyboardEvent>e.NativeEventArgs()).key === "Enter") confirm();
        });

        this.pathInput.getEvents().Subscribe();
        this.confirmButton.getEvents().setOnClick(confirm);

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        });
    }

    public getWorkingDir() : string {
        return this.workingDirInput.Value().trim();
    }

    public getRelativePath() : string {
        return this.relativePathInput.Value().trim();
    }

    public focusInput() : void {
        (<HTMLElement>this.pathInput.InstanceOwner()).focus();
    }

    private getPath() : string {
        return this.pathInput.Value().trim().replace(/^["']|["']$/g, "");
    }

    private getPathSegments(filePath: string) : string[] {
        return filePath.replace(/\\/g, "/").split("/");
    }

    private autoFillWorkingDir() : void {
        const path = this.getPath();
        if (!path) {
            this.setPathError(null);
            return;
        }
        if (!this.isValidPathFormat(path)) {
            this.setPathError("Enter a valid path to a file (e.g. C:\\project\\source\\MyFile.ts)");
            return;
        }
        this.setPathError(null);
        const workingDir = this.detectWorkingDir(path);
        if (!workingDir) return;
        this.workingDirInput.Value(workingDir);
        this.relativePathInput.Value(path.substring(workingDir.length + 1));
    }

    private isValidPathFormat(path: string) : boolean {
        const segments = this.getPathSegments(path).filter((s) => s.length > 0);
        return segments.length >= 2 && segments[segments.length - 1].includes(".");
    }

    private detectWorkingDir(filePath: string) : string | null {
        const sep = filePath.includes("\\") ? "\\" : "/";
        const segments = this.getPathSegments(filePath);
        const markerIdx = segments.findIndex((s) => s === "dependencies" || s === "source");
        if (markerIdx < 1) return null;
        return segments.slice(0, markerIdx).join(sep);
    }

    private setPathError(message: string | null) : void {
        this.pathError.Text(message ?? "");
        this.pathError.Visible(message !== null);
    }

    protected innerHtml() : string {
        return `
<div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.5);z-index:9999;">
    <div class="bg-white p-4 rounded shadow-lg" style="min-width:900px;">
        <p class="mb-1 fw-semibold">File path</p>
        <input data-oidis-bind="${this.pathInput}" type="text" class="form-control" placeholder="C:\\path\\to\\file.ts" />
        <small data-oidis-bind="${this.pathError}" class="text-danger mb-2"></small>
        <p class="mb-1 fw-semibold mt-3">Working directory</p>
        <input data-oidis-bind="${this.workingDirInput}" type="text" class="form-control mb-3" placeholder="C:\\path\\to\\project" />
        <p class="mb-1 fw-semibold">Relative path to file</p>
        <input data-oidis-bind="${this.relativePathInput}" type="text" class="form-control mb-3" placeholder="source\\typescript\\..." />
        <button data-oidis-bind="${this.confirmButton}" class="btn btn-primary">Open</button>
    </div>
</div>`;
    }
}
