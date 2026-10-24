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

const category = { id: "display", label: "Display & Sizing" };

export const DisplayOptions = [
    {
        category: category,
        property: {
            label: "Display",
            bootstrapPrefix: "d-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "None", value: "none" },
            { label: "Inline", value: "inline" },
            { label: "Inline Block", value: "inline-block" },
            { label: "Block", value: "block" },
            { label: "Grid", value: "grid" },
            { label: "Table", value: "table" },
            { label: "Table Cell", value: "table-cell" },
            { label: "Table Row", value: "table-row" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Position",
            bootstrapPrefix: "position-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Relative", value: "relative" },
            { label: "Absolute", value: "absolute" },
            { label: "Fixed", value: "fixed" },
            { label: "Sticky", value: "sticky" },
            { label: "Static", value: "static" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Float",
            bootstrapPrefix: "float-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "None", value: "none" }
        ],
        responsive: true
    },
    {
        category: category,
        property: {
            label: "Z index",
            bootstrapPrefix: "z-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "-1", value: "n1" },
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Width",
            bootstrapPrefix: ""
        },
        options: [
            { label: "Default", value: "" },
            { label: "Auto", value: "w-auto" },
            { label: "100% of Viewport", value: "vw-100" },
            { label: "100% of Parent", value: "w-100" },
            { label: "75% of Parent", value: "w-75" },
            { label: "50% of Parent", value: "w-50" },
            { label: "25% of Parent", value: "w-25" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Height",
            bootstrapPrefix: ""
        },
        options: [
            { label: "Default", value: "" },
            { label: "Auto", value: "h-auto" },
            { label: "100% of Viewport", value: "vh-100" },
            { label: "100% of Parent", value: "h-100" },
            { label: "75% of Parent", value: "h-75" },
            { label: "50% of Parent", value: "h-50" },
            { label: "25% of Parent", value: "h-25" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Overflow",
            bootstrapPrefix: "overflow-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Auto", value: "auto" },
            { label: "Hidden", value: "hidden" },
            { label: "Visible", value: "visible" },
            { label: "Scroll", value: "scroll" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Overflow X",
            bootstrapPrefix: "overflow-x-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Auto", value: "auto" },
            { label: "Hidden", value: "hidden" },
            { label: "Visible", value: "visible" },
            { label: "Scroll", value: "scroll" }
        ],
        responsive: false
    },
    {
        category: category,
        property: {
            label: "Overflow Y",
            bootstrapPrefix: "overflow-y-"
        },
        options: [
            { label: "Default", value: "" },
            { label: "Auto", value: "auto" },
            { label: "Hidden", value: "hidden" },
            { label: "Visible", value: "visible" },
            { label: "Scroll", value: "scroll" }
        ],
        responsive: false
    }
];
