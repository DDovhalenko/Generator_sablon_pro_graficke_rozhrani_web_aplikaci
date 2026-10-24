/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

import { Test } from "@io-oidis-commons/test/unit/Io/Oidis/Commons/BaseUnitTestRunner.js";
import { UnitTestRunner } from "./UnitTestRunner.js";

export class DummyTest extends UnitTestRunner {
    @Test()
    protected DummyCase() : void {
        // dummy test to bypass builder issue
    }
}
