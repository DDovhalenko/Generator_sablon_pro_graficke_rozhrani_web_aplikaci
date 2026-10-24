/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 * 
 * Authored by Dmytro Dovhalenko
 *
 * ********************************************************************************************************* */

const category = { id: "flexbox", label: "Flexbox" };

export const FlexboxOptions = [
    {
        category: category,
        property: {
            label: "Display",
            bootstrapPrefix: "d-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Flex", value: "flex" },
            { label: "Inline Flex", value: "inline-flex" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Direction",
            bootstrapPrefix: "flex-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Row", value: "row" },
            { label: "Row Reverse", value: "row-reverse" },
            { label: "Column", value: "column" },
            { label: "Column Reverse", value: "column-reverse" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Grow",
            bootstrapPrefix: "flex-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Yes", value: "grow-1" },
            { label: "No", value: "grow-0" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Shrink",
            bootstrapPrefix: "flex-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Yes", value: "shrink-1" },
            { label: "No", value: "shrink-0" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Fill",
            bootstrapPrefix: "flex-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Yes", value: "fill" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Justify Content",
            bootstrapPrefix: "justify-content-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Between", value: "between" },
            { label: "Around", value: "around" },
            { label: "Evenly", value: "evenly" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Align Items",
            bootstrapPrefix: "align-items-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Baseline", value: "baseline" },
            { label: "Stretch", value: "stretch" }
        ],
        responsive: true
    }
];
