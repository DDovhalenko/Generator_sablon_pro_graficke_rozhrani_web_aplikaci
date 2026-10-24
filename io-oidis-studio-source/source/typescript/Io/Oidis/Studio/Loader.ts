/*! ******************************************************************************************************** *
 *
 * Copyright 2016-2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { Loader as Parent } from "@io-oidis-localhost/Io/Oidis/Localhost/Loader.js";
import "./ForceCompile.js";
import { IProject } from "./Interfaces/IProject.js";

export class Loader extends Parent {

    public static getInstance() : Loader {
        return <Loader>super.getInstance();
    }

    public getAppConfiguration() : IProject {
        return <IProject>super.getAppConfiguration();
    }
}
