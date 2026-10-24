/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

//generated imports start
import {Label} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Label.js";
import {Button} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Button.js";
//generated imports end
export class HeaderPanel extends BasePanel {
    //generated variables start
    public readonly title : Label;
    public readonly homeButton : Button;
    public readonly myButton : Button;
    public readonly aboutButton : Button;
    public readonly contactButton : Button;
    //generated variables end

    constructor() {
        super();

        //generated inicialization start
        this.title = new Label();
        this.homeButton = new Button();
        this.myButton = new Button();
        this.aboutButton = new Button();
        this.contactButton = new Button();
        //generated inicialization end
        this.attachClickHandlers();
    }

    private attachClickHandlers() : void {
        this.homeButton.getEvents().setOnClick(() => {
        });
    }

    protected innerHtml() : string {
        //generated html start
        return `
<header class="HeaderPanel d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
  <div class="d-flex align-items-center gap-2">
    <img src="/resource/graphics/Io/Oidis/Studio/Gui/Pages/MainPage/Logo.svg" alt="Logo" class="img-fluid" style="height: 32px;">
    <strong data-oidis-bind="${this.title}">Oidis Studio Test</strong>
  </div>
  <nav class="d-flex gap-2">
    <button type="button" data-oidis-bind="${this.homeButton}" class="btn btn-outline-primary">Home</button>
    <button type="button" data-oidis-bind="${this.myButton}" class="btn btn-primary" style="width: 250px; margin: 0px 50px 0px 0px;">NewButton</button>
    <button type="button" data-oidis-bind="${this.aboutButton}" class="btn btn-outline-primary">About</button>
    <button type="button" data-oidis-bind="${this.contactButton}" class="btn btn-outline-primary">Contact</button>
  </nav>
</header>
        `;
        //generated html end
    }
}
