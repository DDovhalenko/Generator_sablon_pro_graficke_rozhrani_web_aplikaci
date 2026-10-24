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
//generated imports start
import {Label} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Label.js";
import {Button} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Button.js";
import {GuiCommons} from "./../../../../../../Io/Oidis/Gui/Bootstrap/Primitives/GuiCommons.js";
import {HomePanel} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Panels/HomePanel.js";
//generated imports end

export class NewComponent extends BasePanel {
    //generated variables start
    public readonly heading : Label;
    public readonly importButton : Button;
    public readonly saveButton : Button;
    public readonly customSection : GuiCommons;
    public readonly home : HomePanel;
    //generated variables end

    private clickCount : number;

    constructor() {
        super();
        //generated inicialization start
        this.heading = new Label();
        this.importButton = new Button();
        this.saveButton = new Button();
        this.customSection = new GuiCommons();
        this.home = new HomePanel();
        //generated inicialization end

        this.clickCount = 0;
        this.bindActions();
    }

    private bindActions() : void {
        this.importButton.getEvents().setOnClick(() => {
            this.clickCount++;
        });
    }

    public getClickCount() : number {
        return this.clickCount;
    }

    protected innerHtml() : string {
        //generated html start
        return `
<section class="MainSection p-3">
  <div class="d-flex justify-content-between align-items-center p-2 border-bottom mb-3">
    <h2 data-oidis-bind="${this.heading}">Main Section
    </h2>
    <div class="d-flex gap-2">
      <button type="button" data-oidis-bind="${this.importButton}" class="btn btn-primary">Import HTML</button>
      <button type="button" data-oidis-bind="${this.saveButton}" class="btn btn-success">Save Changes</button>
    </div>
  </div>
  <div role="alert" class="alert alert-info">
    <span><strong>Info:</strong> Edit this section using the studio editor.</span>
  </div>
  <div data-oidis-bind="${this.customSection}" class="p-3 border rounded">
    <h3>Lorem ipsum
    </h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
    <ul>
      <li>Item one
      </li>
      <li>Item two
      </li>
      <li>Item three
      </li>
    </ul>
  </div>
</section>
<div data-oidis-bind="${this.home}">
</div>
<span>Span</span>
<strong>Bold</strong>
<small>Small</small>
        `;
        //generated html end
    }
}
