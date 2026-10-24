/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */
import { BasePanel } from "@io-oidis-gui/Io/Oidis/Gui/Bootstrap/Primitives/BasePanel.js";
//generated imports start
import {Label} from "@io-oidis-usercontrols/Io/Oidis/UserControls/Bootstrap/UserControls/Label.js";
//generated imports end
import { StringUtils } from "@io-oidis-commons/Io/Oidis/Commons/Utils/StringUtils.js";

export class FooterPanel extends BasePanel {
    //generated variables start
    public readonly copyright : Label;
    public readonly version : Label;
    //generated variables end

    constructor() {
        super();
        //generated inicialization start
        this.copyright = new Label();
        this.version = new Label();
        //generated inicialization end
    }

    public getCopyrightYear() : string {
        return StringUtils.YearFrom(2026);
    }

    protected innerHtml() : string {
        //generated html start
        return `
<footer class="FooterPanel p-3 border-top text-center bg-light">
  <div role="alert" class="alert mb-2 alert-secondary">
    <span><strong>Notice:</strong> This is a demo footer for the test project.</span>
  </div>
  <small data-oidis-bind="${this.copyright}">© ${this.getCopyrightYear()} Oidis</small>
  <span> · </span>
  <small data-oidis-bind="${this.version}">v0.0.1</small>
</footer>
        `;
        //generated html end
    }
}
