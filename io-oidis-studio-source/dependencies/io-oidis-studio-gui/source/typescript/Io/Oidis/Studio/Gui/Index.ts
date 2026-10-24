/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { Resolver, ResolverScope } from "@io-oidis-commons/Io/Oidis/Commons/Primitives/Decorators.js";
import { IndexPage } from "@io-oidis-gui/Io/Oidis/Gui/Pages/IndexPage.js";
import { AsyncBasePageController } from "@io-oidis-services/Io/Oidis/Services/HttpProcessor/Resolvers/AsyncBasePageController.js";

@Resolver(["/", "/index", "/index.html", "/web/"], {scope: ResolverScope.DEV})
export class Index extends AsyncBasePageController {

    constructor() {
        super();
        this.setInstanceOwner(new IndexPage());
    }

    protected async onSuccess($instance : IndexPage) : Promise<void> {
        $instance.headerTitle.Content("Studio");
        $instance.headerInfo.Content("Oidis Framework code base for Drag-and-Drop GUI editor");

        let content : string = "";
        /* dev:start */
        content += `
            <h3>Pages</h3>
            <a href="/#/main">Main Page</a>

            <h3>Runtime tests</h3>
            `;
        /* dev:end */

        $instance.pageIndex.Content(content);
        $instance.footerInfo.Content("" +
            "version: " + this.getEnvironmentArgs().getProjectVersion() +
            ", build: " + this.getEnvironmentArgs().getBuildTime() +
            ", " + this.getEnvironmentArgs().getProjectConfig().target.copyright);
    }
}
