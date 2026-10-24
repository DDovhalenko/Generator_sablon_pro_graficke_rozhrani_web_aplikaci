/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { BaseUnitTestRunner } from "@io-oidis-commons/test/unit/Io/Oidis/Commons/BaseUnitTestRunner.js";
import { EnvironmentArgs } from "@io-oidis-localhost/Io/Oidis/Localhost/EnvironmentArgs.js";
import { Loader } from "../../../../../../source/typescript/Io/Oidis/Studio/Loader.js";

export class UnitTestEnvironmentArgs extends EnvironmentArgs {
    public Load($appConfig : any, $handler : () => void) : void {
        super.Load($appConfig, $handler);
    }

    protected getConfigPaths() : string[] {
        return [];
    }
}

export class UnitTestLoader extends Loader {
    protected initEnvironment() : UnitTestEnvironmentArgs {
        return new UnitTestEnvironmentArgs();
    }
}

export class UnitTestRunner extends BaseUnitTestRunner {
    protected initLoader() : void {
        super.initLoader(UnitTestLoader);
    }
}
