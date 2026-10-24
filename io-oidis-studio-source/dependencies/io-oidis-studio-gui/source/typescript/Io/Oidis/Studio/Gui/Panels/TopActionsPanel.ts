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
import { DropDownList, DropDownListItem } from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/DropDownList.js";

export class TopActionsPanel extends BasePanel {

    public readonly fileDropdown     : DropDownList;
    public readonly importItem       : DropDownListItem;
    public readonly exportFileItem   : DropDownListItem;
    public readonly saveItem         : DropDownListItem;

    public readonly desktopBtn : Button;
    public readonly tabletBtn  : Button;
    public readonly mobileBtn  : Button;

    public readonly toolsDropdown  : DropDownList;
    public readonly bordersItem    : DropDownListItem;
    public readonly exportTplItem  : DropDownListItem;

    constructor() {
        super();
        this.fileDropdown = new DropDownList();
        this.fileDropdown.Text("File");
        this.importItem     = this.fileDropdown.AddItem("Open another file");
        this.exportFileItem = this.fileDropdown.AddItem("Export file");
        this.saveItem       = this.fileDropdown.AddItem("Save file to current path");

        this.desktopBtn = new Button();
        this.tabletBtn  = new Button();
        this.mobileBtn  = new Button();

        this.toolsDropdown = new DropDownList();
        this.toolsDropdown.Text("Additional Tools");
        this.bordersItem   = this.toolsDropdown.AddItem("Toggle borders");
        this.exportTplItem = this.toolsDropdown.AddItem("Export template");
    }

    protected innerHtml() : string {
        return `
<div class="d-flex justify-content-between align-items-center gap-2 p-1">
    <div class="btn-group btn-group-sm" role="group">
        <button class="btn btn-sm btn-top-action" type="button" data-oidis-bind="${this.desktopBtn}">
            <svg class="bi bi-laptop" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"></path>
            </svg>
        </button>
        <button class="btn btn-sm btn-top-action" type="button" data-oidis-bind="${this.tabletBtn}">
            <svg class="bi bi-tablet" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
            </svg>
        </button>
        <button class="btn btn-sm btn-top-action" type="button" data-oidis-bind="${this.mobileBtn}">
            <svg class="bi bi-phone" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
            </svg>
        </button>
    </div>
    <div class="d-flex">
        <div data-oidis-bind="${this.fileDropdown}" style="margin-right: 5px;"></div>
        <div data-oidis-bind="${this.toolsDropdown}"></div>
    </div>
</div>`;
    }
}
