/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react";
import {
    SectionWithRows,
} from '@/src/interface'

const TemplateEditor = () => {
    // const [template, setTemplate] = useState<SectionWithRows[]>([]);

    // const addSection = () => {
    //     setTemplate((prev) => [
    //         ...prev,
    //         {
    //             section_style: "",
    //             section_fields: [],
    //         },
    //     ]);
    // };

    // const addRow = (sectionIndex: number) => {
    //     setTemplate((prev) => {
    //         const updated = [...prev];
    //         updated[sectionIndex].section_fields.push({
    //             section_style: "",
    //             section_fields: [],
    //         });
    //         return updated;
    //     });
    // };

    // const addColumn = (sectionIndex: number, rowIndex: number) => {
    //     setTemplate((prev) => {
    //         const updated = [...prev];
    //         updated[sectionIndex].section_fields[rowIndex].section_fields.push({
    //             section_fields: {
    //                 section_style: "",
    //                 section_fields: [],
    //             },
    //             section_style: "",
    //         });
    //         return updated;
    //     });
    // };

    // const addField = (
    //     sectionIndex: number,
    //     rowIndex: number,
    //     columnIndex: number,
    //     field: string
    // ) => {
    //     setTemplate((prev) => {
    //         const updated = [...prev];
    //         updated[sectionIndex].section_fields[rowIndex].section_fields[
    //             columnIndex
    //         ].section_fields.section_fields.push(field);
    //         return updated;
    //     });
    // };

    return (
        <div>
            <h1>Template Editor</h1>
            {/* {template.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Section Style"
                        value={section.section_style}
                        onChange={(e) => {
                            const updated = [...template];
                            updated[sectionIndex].section_style = e.target.value;
                            setTemplate(updated);
                        }}
                    />
                    <button onClick={() => addRow(sectionIndex)}>Add Row</button>
                    {section.section_fields.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ marginLeft: "20px" }}>
                            <input
                                type="text"
                                placeholder="Row Style"
                                value={row.section_style}
                                onChange={(e) => {
                                    const updated = [...template];
                                    updated[sectionIndex].section_fields[
                                        rowIndex
                                    ].section_style = e.target.value;
                                    setTemplate(updated);
                                }}
                            />
                            <button onClick={() => addColumn(sectionIndex, rowIndex)}>
                                Add Column
                            </button>
                            {row.section_fields.map((column, columnIndex) => (
                                <div key={columnIndex} style={{ marginLeft: "40px" }}>
                                    <input
                                        type="text"
                                        placeholder="Column Style"
                                        value={column.section_fields.section_style}
                                        onChange={(e) => {
                                            const updated = [...template];
                                            updated[sectionIndex].section_fields[rowIndex]
                                                .section_fields[columnIndex].section_fields.section_style =
                                                e.target.value;
                                            setTemplate(updated);
                                        }}
                                    />
                                    <button
                                        onClick={() =>
                                            addField(sectionIndex, rowIndex, columnIndex, "New Field")
                                        }
                                    >
                                        Add Field
                                    </button>
                                    <ul>
                                        {column.section_fields.section_fields.map((field, idx) => (
                                            <li key={idx}>{field}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={addSection}>Add Section</button>
            <pre>{JSON.stringify(template, null, 2)}</pre> */}
        </div>
    );
};

export default TemplateEditor;
