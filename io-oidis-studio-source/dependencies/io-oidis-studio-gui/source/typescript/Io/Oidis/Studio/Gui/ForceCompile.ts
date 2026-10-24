/*! ******************************************************************************************************** *
 *
 * Copyright 2025 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 *
 * ********************************************************************************************************* */

// Main goal of this file is to provide ability to force process of TS compile by list of imports below

// Reason for this is that source code can contain classes used only over LCP or by target project
// If not mentioned here it can be missing at runtime and cause also target project loading issues

import "./Controllers/Pages/MainPageController.js";
import "./Index.js";

// generated-code-start
// generated-code-end
