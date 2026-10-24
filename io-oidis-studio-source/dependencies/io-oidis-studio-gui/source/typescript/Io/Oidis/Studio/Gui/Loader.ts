/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { IProject } from "@io-oidis-commons/Io/Oidis/Commons/Interfaces/IProject.js";
import { appExceptionHandler } from "@io-oidis-commons/Io/Oidis/Commons/Utils/EnvironmentHelper.js";
import { Loader as Parent } from "@io-oidis-services/Io/Oidis/Services/Loader.js";
import "./ForceCompile.js";
import { HttpResolver } from "@io-oidis-services/Io/Oidis/Services/HttpProcessor/HttpResolver.js";

export class Loader extends Parent {

    public static getInstance() : Loader {
        return <Loader>super.getInstance();
    }

    public Process($appConfig : string | IProject) {
        try {
            super.Process($appConfig);
        } catch (ex) {
            appExceptionHandler(ex.message, ex.stack);
        }
    }

    protected initResolver() : HttpResolver {
        return new HttpResolver("/");
    }
}
