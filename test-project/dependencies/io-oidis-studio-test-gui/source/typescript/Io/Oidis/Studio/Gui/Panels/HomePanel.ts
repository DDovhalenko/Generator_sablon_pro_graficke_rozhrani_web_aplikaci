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
import {HeaderPanel} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Panels/HeaderPanel.js";
import {MainComponent} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Panels/MainComponent.js";
import {FooterPanel} from "@io-oidis-studio-gui/Io/Oidis/Studio/Gui/Panels/FooterPanel.js";
//generated imports end

import { LogIt } from "@io-oidis-commons/Io/Oidis/Commons/Utils/LogIt.js";

export class HomePanel extends BasePanel {
    //generated variables start
    public readonly header : HeaderPanel;
    public readonly mainSection : MainComponent;
    public readonly footer : FooterPanel;
    //generated variables end

    private readonly buildDate : string;

    constructor() {
        super();
        //generated inicialization start
        this.header = new HeaderPanel();
        this.mainSection = new MainComponent();
        this.footer = new FooterPanel();
        //generated inicialization end

        this.buildDate = new Date().toISOString();
        LogIt.Debug("HomePanel created at: " + this.buildDate);
    }

    public getBuildDate() : string {
        return this.buildDate;
    }

    protected innerHtml() : string {
        //generated html start
        return `
<section class="HomePage">
  <div class="d-flex flex-column min-vh-100">
    <div data-oidis-bind="${this.header}" class="HeaderArea">
    </div>
    <div data-oidis-bind="${this.mainSection}" class="MainArea flex-grow-1 p-3">
    </div>
    <div data-oidis-bind="${this.footer}" class="FooterArea">
    </div>
  </div>
</section>
        `;
        //generated html end
    }
}
