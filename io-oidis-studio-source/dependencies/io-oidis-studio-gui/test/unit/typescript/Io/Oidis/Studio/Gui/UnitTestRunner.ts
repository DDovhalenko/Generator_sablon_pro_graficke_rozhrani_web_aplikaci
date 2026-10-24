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
import { UnitTestEnvironmentArgs } from "@io-oidis-commons/test/unit/Io/Oidis/Commons/UnitTestRunner.js";
import { Loader } from "../../../../../../../source/typescript/Io/Oidis/Studio/Gui/Loader.js";

export class UnitTestLoader extends Loader {
    protected processProgramArgs() : boolean {
        // skip DB connectivity
        return true;
    }

    protected initEnvironment() : UnitTestEnvironmentArgs {
        return new UnitTestEnvironmentArgs();
    }
}

export class UnitTestRunner extends BaseUnitTestRunner {
    protected initLoader() : void {
        super.initLoader(UnitTestLoader);
    }
}
