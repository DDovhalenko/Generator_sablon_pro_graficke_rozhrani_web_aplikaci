/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { BasePanel } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/BasePanel.js";
import {Label} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Label.js";
import {TextField} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/TextField.js";
import {Button} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Button.js";

export class TestComponent extends BasePanel {
    public readonly colorLabel : Label;
    public readonly textInput : TextField;
    public readonly applyButton : Button;
    public readonly colorsLabel : Label;


    constructor() {
        super();
        this.colorLabel = new Label();
        this.textInput = new TextField();
        this.applyButton = new Button();
        this.colorsLabel = new Label();
}

    protected innerHtml() : string {
        const isActive     = true;
        const activeClass  = isActive ? "btn-primary" : "btn-secondary";
        const wrapperStyle = isActive ? "border: 2px solid #6f42c1;" : "border: 1px solid #ccc;";
        return `
<div class="p-3 rounded">
  <h5 class="mb-3">Test component
  </h5>
  <div class="mb-2 d-flex align-items-center gap-2">
    <span data-oidis-bind="${this.colorLabel}" class="fw-semibold">Text input:</span>
    <input type="text" data-oidis-bind="${this.textInput}" class="form-control form-control-color" style="width: 200px;">
  </div>
  <div class="d-flex align-items-center gap-2">
    <button type="button" data-oidis-bind="${this.applyButton}" class="btn ${activeClass} btn-sm">Apply</button>
  </div>
</div>
<div class="dropdown">
  <button type="button" data-bs-toggle="dropdown" aria-expanded="false" class="btn btn-primary dropdown-toggle">Dropdown</button>
  <div class="dropdown-menu show">
    <a href="#" class="dropdown-item">First action</a>
    <a href="#" class="dropdown-item">Second action</a>
    <a href="#" class="dropdown-item">Third action</a>
  </div>
</div>
        `;
    }
}
