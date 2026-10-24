/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { StringUtils } from "@io-oidis-commons/Io/Oidis/Commons/Utils/StringUtils.js";
import { PageContentBundles, PageContentBundleType } from "@io-oidis-gui/Io/Oidis/Gui/Utils/PageContentBundles.js";
import { FrontEndLoader as Parent } from "@io-oidis-localhost/Io/Oidis/Localhost/HttpProcessor/Resolvers/FrontEndLoader.js";
import { Resolver } from "@io-oidis-commons/Io/Oidis/Commons/Primitives/Decorators.js";
import { StaticPageContentManager } from "@io-oidis-gui/Io/Oidis/Gui/Utils/StaticPageContentManager.js";

@Resolver("/")
export class FrontEndLoader extends Parent {

    protected setContent() {
        super.setContent();
        const buildTime : number = new Date(this.getEnvironmentArgs().getBuildTime()).getTime();
        PageContentBundles.getInstance().Apply(PageContentBundleType.BOOTSTRAP);
        StaticPageContentManager.HeadLinkAppend("resource/libs/Grapesjs/grapes.min.css?v=" + buildTime);
        StaticPageContentManager.HeadScriptAppend("resource/libs/Grapesjs/grapes.min.js?v=" + buildTime);
        }

    protected getLicense() : string {
        return `
<!--

Copyright ${StringUtils.YearFrom(2016)} Oidis

SPDX-License-Identifier: BSD-3-Clause
The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution

or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText

-->
`;
    }
}
