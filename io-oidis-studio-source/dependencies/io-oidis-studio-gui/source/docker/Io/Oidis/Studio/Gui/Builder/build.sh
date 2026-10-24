#!/usr/bin/env bash
# * ********************************************************************************************************* *
# *
# * Copyright 2025 Oidis
# *
# * SPDX-License-Identifier: BSD-3-Clause
# * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
# * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
# *
# * ********************************************************************************************************* *

oidis --version

oidis install || exit 1

oidis test coverage  --ignore-tests="$OIDIS_IGNORE_TESTS" || exit 1

oidis rebuild-eap || exit 1
