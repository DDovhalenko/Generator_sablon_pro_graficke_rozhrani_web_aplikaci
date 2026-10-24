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
import { GuiCommons } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/GuiCommons.js";
import { TopActionsPanel } from "./TopActionsPanel.js";
import { PathInputDialog } from "../Dialogs/PathInputDialog.js";

export class HomePanel extends BasePanel {
    public readonly topPanel : GuiCommons;
    public readonly bottomPanel : GuiCommons;
    public readonly leftButtons : GuiCommons;
    public readonly topActions : TopActionsPanel;
    public readonly rightButtons : GuiCommons;
    public readonly workingArea : GuiCommons;
    public readonly leftPanel : GuiCommons;
    public readonly blocks : GuiCommons;
    public readonly rightPanel : GuiCommons;
    public readonly layers : GuiCommons;
    public readonly styles : GuiCommons;
    public readonly options         : GuiCommons;
    public readonly pathInputDialog : PathInputDialog;
    public readonly toastContainer  : GuiCommons;

    constructor() {
        super();
        this.topPanel        = new GuiCommons();
        this.bottomPanel     = new GuiCommons();
        this.leftButtons     = new GuiCommons();
        this.topActions      = new TopActionsPanel();
        this.rightButtons    = new GuiCommons();
        this.workingArea     = new GuiCommons();
        this.leftPanel       = new GuiCommons();
        this.blocks          = new GuiCommons();
        this.rightPanel      = new GuiCommons();
        this.layers          = new GuiCommons();
        this.styles          = new GuiCommons();
        this.options         = new GuiCommons();
        this.pathInputDialog = new PathInputDialog();
        this.toastContainer  = new GuiCommons();
    }

    protected innerHtml() : string {
        return `
<section>
    <div class="h-100 vw-100 d-flex flex-column ">
        <div class="TopPanel" data-oidis-bind="${this.topPanel}">
            <div class="LeftButtons" data-oidis-bind="${this.leftButtons}"></div>
            <div class="BasicActions" data-oidis-bind="${this.topActions}"></div>
            <div class="RightButtons" data-oidis-bind="${this.rightButtons}"></div>
        </div>
        <div class="MainContainer">
          <div class="LeftPanel" data-oidis-bind="${this.leftPanel}">
            <div class="BlocksContainer" data-oidis-bind="${this.blocks}"></div>
            <div class="LayersContainer" data-oidis-bind="${this.layers}"></div>
          </div>
          <div class="EditorContainer">
            <div class="WorkingArea" data-oidis-bind="${this.workingArea}"></div>
            <div class="BottomPanel" data-oidis-bind="${this.bottomPanel}"></div>
          </div>
          <div class="RightPanel" data-oidis-bind="${this.rightPanel}">
            <div class="StylesContainer" data-oidis-bind="${this.styles}"></div>
            <div class="OptionsContainer" data-oidis-bind="${this.options}"></div>
          </div>
        </div>
    </div>
    <div data-oidis-bind="${this.pathInputDialog}"></div>
    <div data-oidis-bind="${this.toastContainer}" class="toast-container position-fixed top-0 end-0 p-3" style="z-index:11000;"></div>
</section>
        `;
    }
}
