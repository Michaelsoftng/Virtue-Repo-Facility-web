/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { GrTableAdd } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";
import {ColumnWithRowsFields, SectionWithRows, SingleColumnRow} from '@/src/interface'
import { RiPlayListAddLine } from "react-icons/ri";
import { RiFunctionAddFill } from "react-icons/ri";
import LogoIcon from '@/src/reuseable/icons/LogoIcon'

const NewTemplate = () => {
    const [preview, setOpenPreview] = useState(false)
    const [template, setTemplate] = useState<SectionWithRows[]>([]);
    const addSection = () => {
        setTemplate((prev) => [
            ...prev,
            {
                section_style: "",
                section_fields: [
                    {
                        section_style: "",
                        section_fields: [
                            {
                                section_style: "w-full mt-2",
                                section_fields: [
                                    "enter text here"
                                ]
                            }
                        ]
                    }
                ],
            },
            
        ]);
    };

    const addRow = useCallback((sectionIndex: number) => {
        console.log("Before update:");
        setTemplate((prev) => {
            // Make sure we create a new array and don't mutate the previous state
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    // Create a new array for section_fields to prevent mutation
                    return {
                        ...section,
                        section_fields: [
                            ...section.section_fields, // Create a new array
                            {
                                section_style: "",
                                section_fields: [
                                    {
                                        section_style: "",
                                        section_fields: [
                                            "enter text here"
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                }
                return section;
            });
            return updated;
        });
    }, []);

    const addColumn = (sectionIndex: number, rowIndex: number) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    const newSectionFields = section.section_fields.map((row, rIndex) => {
                        if (rIndex === rowIndex) {
                            // Add a new column with the correct structure
                            return {
                                ...row,
                                section_fields: [
                                    ...row.section_fields, // This will correctly infer the type as SingleColumnRow[]
                                    {
                                        section_style: "", section_fields: [
                                            "enter text here"
                                        ]
                                    } // New column with the correct type
                                ] as SingleColumnRow[]
                            };
                        }
                        return row;
                    });

                    return {
                        ...section,
                        section_fields: newSectionFields,
                    };
                }
                return section;
            });

            return updated; // Return the updated template
        });
    };

    const addField = (
        sectionIndex: number,
        rowIndex: number,
        columnIndex: number,
        field: string
    ) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    const newSectionFields = section.section_fields.map((row, rIndex) => {
                        if (rIndex === rowIndex) {
                            const newColumns = row.section_fields.map((column, cIndex) => {
                                if (cIndex === columnIndex) {
                                    // Add the new field to the specific column's section_fields
                                    return {
                                        ...column,
                                        section_fields: [
                                            ...column.section_fields, // Copy the existing fields
                                            field // Add the new field
                                        ] as string[]
                                    };
                                }
                                return column;
                            });

                            return {
                                ...row,
                                section_fields: newColumns, // Assign the updated columns
                            };
                        }
                        return row;
                    });

                    return {
                        ...section,
                        section_fields: newSectionFields, // Assign the updated section_fields
                    };
                }
                return section;
            });

            return updated; // Return the updated template
        });
    };


    const deleteSection = (sectionIndex: number) => {
        setTemplate((prev) => prev.filter((_, index) => index !== sectionIndex));
    };

    const deleteRow = (sectionIndex: number, rowIndex: number) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    // Remove the row at the given index
                    return {
                        ...section,
                        section_fields: section.section_fields.filter((_, rIndex) => rIndex !== rowIndex),
                    };
                }
                return section;
            });
            return updated;
        });
    };

    const deleteColumn = (sectionIndex: number, rowIndex: number, columnIndex: number) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    const newSectionFields = section.section_fields.map((row, rIndex) => {
                        if (rIndex === rowIndex) {
                            // Remove the column at the given index
                            return {
                                ...row,
                                section_fields: row.section_fields.filter((_, cIndex) => cIndex !== columnIndex),
                            };
                        }
                        return row;
                    });

                    return {
                        ...section,
                        section_fields: newSectionFields,
                    };
                }
                return section;
            });

            return updated;
        });
    };

    const deleteField = (
        sectionIndex: number,
        rowIndex: number,
        columnIndex: number,
        fieldIndex: number
    ) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    const newSectionFields = section.section_fields.map((row, rIndex) => {
                        if (rIndex === rowIndex) {
                            const newColumns = row.section_fields.map((column, cIndex) => {
                                if (cIndex === columnIndex) {
                                    // Remove the field at the given index
                                    return {
                                        ...column,
                                        section_fields: column.section_fields.filter((_, fIndex) => fIndex !== fieldIndex),
                                    };
                                }
                                return column;
                            });

                            return {
                                ...row,
                                section_fields: newColumns,
                            };
                        }
                        return row;
                    });

                    return {
                        ...section,
                        section_fields: newSectionFields,
                    };
                }
                return section;
            });

            return updated;
        });
    };

    // // Use this in buttons to avoid event propagation
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleFieldChange = (
        sectionIndex: number,
        rowIndex: number,
        columnIndex: number,
        fieldIndex: number,
        value: string
    ) => {
        setTemplate((prev) => {
            const updated = prev.map((section, index) => {
                if (index === sectionIndex) {
                    const newSectionFields = section.section_fields.map((row, rIndex) => {
                        if (rIndex === rowIndex) {
                            const newColumns = row.section_fields.map((column, cIndex) => {
                                if (cIndex === columnIndex) {
                                    const updatedField = [...column.section_fields]; // Copy the field array
                                    updatedField[fieldIndex] = value; // Update the field at the specific index
                                    return {
                                        ...column,
                                        section_fields: updatedField, // Assign the updated field array
                                    };
                                }
                                return column;
                            });

                            return {
                                ...row,
                                section_fields: newColumns,
                            };
                        }
                        return row;
                    });

                    return {
                        ...section,
                        section_fields: newSectionFields,
                    };
                }
                return section;
            });

            return updated;
        });
    };

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className="w-full pt-6">
                            <div className="bg-[#EEFEF4] w-full py-[21px] px-[35px]">
                                
                                <main className="mt-4 pb-4">
                                    <div>
                                        <ul>
                                            {template.map((section, sectionIndex) => (
                                                <section key={sectionIndex} className={`py-4  border-black pt-1 mt-1 ${sectionIndex == 0 ? "border-t-0" : "border-t-2"} `}>
                                                        
                                                    {section.section_fields.map((row, rowIndex) => (
                                                        <div key={rowIndex} className="grid grid-cols-[90%_10%]">
                                                            <li key={rowIndex} className={`text-[12px] grid grid-cols-3 gap-x-2 mt-4`}>
                                                                {row.section_fields.map((column, columnIndex) => (
                                                                    
                                                                    <div key={columnIndex} >
                                                                        {column.section_fields.map((field, idx) => (
                                                                            <p
                                                                                key={idx}
                                                                                className={`${column.section_style} ${idx === 0 ? "mt-0" : ""} ${(idx === column.section_fields.length - 1 && columnIndex == 0 )? "border-b-4 border-dotted border-black pb-2" : ""
                                                                                    }`}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder={`${field}`}  
                                                                                    className="w-full bg-slate-200 text-black px-2 py-1"
                                                                                    value={field} // Display the current value of the field
                                                                                    onChange={(e) =>
                                                                                        handleFieldChange(
                                                                                            sectionIndex,
                                                                                            rowIndex,
                                                                                            columnIndex,
                                                                                            idx,
                                                                                            e.target.value // Pass the new value entered by the user
                                                                                        )
                                                                                    }
                                                                                    />
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            deleteField(sectionIndex, rowIndex, columnIndex, idx)
                                                                                        }
                                                                                        className="text-red-500 rounded-sm flex justify-evenly gap-1 px-2 py-1 "> <span className="mt-[3px]"><RiDeleteBinFill /></span>  <span>remove column</span>
                                                                                    </button>
                                                                                
                                                                            </p>
                                                                        ))}
                                                                        <div className=" w-[200px] flex justify-between mt-2 " key={`div-${sectionIndex}${rowIndex}${columnIndex}`}>
                                                                            <button
                                                                                onClick={() =>
                                                                                    addField(sectionIndex, rowIndex, columnIndex, "New Field")
                                                                                }
                                                                                className="text-blue-500 rounded-sm flex gap-1 justify-evenly py-1"
                                                                            >
                                                                                <span className="mt-[3px]"><RiFunctionAddFill /></span>  <span>new field</span>
                                                                            </button>
                                                                        
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteColumn(sectionIndex, rowIndex, columnIndex)
                                                                                }
                                                                                className="text-red-500 rounded-sm flex justify-evenly gap-1 px-2 py-1 "> <span className="mt-[3px]"><RiDeleteBinFill /></span>  <span>remove column</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                

                                                            </li>
                                                            
                                                            <div className="flex justify-evenly mt-2" key={`div-${sectionIndex}${rowIndex}`}>
                                                                <button key={`ac-${sectionIndex}${rowIndex}`} onClick={() => addColumn(sectionIndex, rowIndex)} className="text-green-600 rounded-sm flex justify-evenly px-2 -py-1"><span className="mt-[3px]"><GrTableAdd /> </span></button>
                                                                <button key={`dr-${sectionIndex}${rowIndex}`} onClick={() => deleteRow(sectionIndex, rowIndex)} className="border-2 border-red-500 text-red-500 rounded-sm flex justify-evenly gap-2 px-2 -py-2 "> <span className="mt-[3px]"><RiDeleteBinFill /></span> <span>row</span>
                                                                </button>

                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    <div className="flex justify-between mt-5" key={`div-${sectionIndex}`}  >
                                                        <button key={`ar-${sectionIndex}`} onClick={(e) => { handleClick(e); addRow(sectionIndex) }} className="text-blue-500 rounded-sm flex justify-evenly px-2 -py-1"><span className="mt-[3px]"><RiPlayListAddLine /> </span></button>
                                                        <button key={`ds-${sectionIndex}`} onClick={() => deleteSection(sectionIndex) } className="border-2 border-red-500 text-red-500 rounded-sm flex justify-evenly gap-2 px-2 -py-2 "> <span className="mt-[3px]"><RiDeleteBinFill /></span> <span>section</span></button>

                                                    </div>
                                                </section>
                                            ))}
                                            
                                        </ul>
                                    </div>
                                </main>
                                <footer >
                                    <div className="grid grid-cols-[65%_35%] gap-3">
                                        <div className="bg-[#121E3F] px-3 py-2 text-white text-[10px]"><p>Thank you for choosing Labtraca. If you have any questions or comments, please email help@labtraca.com or call 0900 000 0000</p></div>
                                        <div className="bg-[#121E3F] px-3 py-2 text-white text-center text-[14px] flex justify-center items-center" ><p>+234 9000 000 0000</p></div>
                                    </div>
                                    <div className="text-[11px] mt-2"><i>RC Number:&nbsp;489766</i></div>
                                </footer>
                            </div>
                            <div className="grid grid-cols-6 gap-3">
                                <button className="bg-gray-600 font-600 py-2 px-3 text-[14px] block mt-2 rounded-md text-white " onClick={addSection}>Create Section</button>
                                <button className="bg-blue-600 font-600 py-2 px-3 text-[14px] block mt-2 rounded-md text-white " onClick={() => setOpenPreview(true)}>Preview Template</button>
                                <button className="bg-green-600 font-600 py-2 px-3 text-[14px] block mt-2 rounded-md text-white " onClick={addSection}>Save Template</button>

                                {/* <div>
                                    <pre>{JSON.stringify(template, null, 2)}</pre>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                preview && 
            
            <div className="absolute top-0 bg-[#5d5c5c41] w-full flex justify-center pt-6">
                <div className="">
                    <div className="flex justify-end ">
                        <button onClick={() => setOpenPreview(false)} className="px-2 py-1 mb-2  rounded text-red-600 border-2 border-red-600 bg-white">close preview</button>
                    </div>
                    <div className="bg-[#EEFEF4] w-[776px] py-[21px] px-[35px]" id="pdf-content">
                        <header className="" id="header">
                            <div className="grid grid-cols-[62px_calc(100%-62px)]">
                                <div className="flex items-center justify-center rounded-full">
                                    <LogoIcon />
                                </div>
                                <div className="flex justify-center">
                                    <div className="ml-[-60px]">
                                        <h1 className="text-xl font-[600] text-black uppercase">
                                            Wuse District Hospital, Abuja
                                        </h1>
                                        <p className="text-[12px] font-[600] text-black text-center mt-2">
                                            LABORATORY REPORT FORM - CHEMICAL PATHOLOGY
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="border-2 border-[#121E3F] grid grid-cols-2 mt-[27px]">
                                <div>
                                    <p className="py-[5px] bg-[#121E3F] pl-4 text-white font-[600] text-[13.32px]">Requisition Number</p>
                                    <p className="py-[6px]">&nbsp;</p>
                                </div>
                                <div>
                                    <p className="py-[5px] bg-[#121E3F] pl-8 text-white font-[600] text-[13.32px]">Report Date</p>
                                    <p className="py-[6px]"></p>
                                </div>
                            </div>

                        </header>

                        {/* Main container */}
                        <main className="mt-4 pb-4" id="content">
                            <div className="grid grid-cols-2 text-[12px] mt-4">
                                <div className="ml-4">
                                    <ul>
                                        <li className="mt-2 flex gap-4"><b>Doctor</b><span>SELF REFERRAL</span></li>
                                    </ul>
                                    <ul className="mt-11">
                                        <li className="mt-1 grid grid-cols-2"><span>Date Entered</span><span>10/02/2024 09:18:57</span></li>
                                        <li className="mt-1 grid grid-cols-2"><span>Date Printed</span><span>10/02/2024 09:18:57</span></li>
                                        <li className="mt-1 grid grid-cols-2"><span>Collection Date</span><span>10/02/2024 09:18:57</span></li>
                                    </ul>

                                    <div className="mt-7 text-[10px]"><p>Thank you for your request. We are reporting the following results:</p></div>
                                </div>
                                <div className="ml-4">
                                    <ul>
                                        <li className="mt-2 grid grid-cols-[35%_65%]"><b>Patient Information</b><span></span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Patient</b><span>JOHN DOE</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Email</b><span>info@labtraca.com</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Age</b><span>27 years</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Gender</b><span>Male</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Phone No</b><span>+23490000000000</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Address</b><span>No. 5 Gana street maitama, abuja</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Specimen Type</b><span>SST</span></li>
                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Clinical Data</b><span>NA</span></li>
                                    </ul>
                                </div>

                            </div>
                            <div>
                                <div className="text-[12px] border-b-2 border-black pb-1">
                                    <b>Chemistry - </b>
                                    <b>Lipogram - </b>
                                    <span> Validated</span>
                                </div>
                                <div className="text-[12px] border-b-2 border-black pb-1 mt-1">
                                    <b>Total Cholesterol</b>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <ul>
                                        <section className="text-[12px] border-b-2 border-black pb-1 mt-1" >
                                            <li className="font-[700] text-[12px] grid grid-cols-3">
                                                <p className="flex justify-center">TEST NAME</p>
                                                <p className="flex justify-center">RESULT</p>
                                                <p className="flex justify-center">REFERENCE RANGE / (UNITS)</p>
                                            </li>
                                        </section>
                                        <section className="py-4">
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>

                                            <li className="text-[12px] grid grid-cols-3 mt-4">
                                                <div >
                                                    <p>Desirable:&gt;5.2 mmol/l</p>
                                                    <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">221</p>
                                                <p className="flex justify-center">mg/dL</p>
                                            </li>
                                        </section>
                                        <section className="py-4">
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>

                                            <li className="text-[12px] grid grid-cols-3 mt-4">
                                                <div >
                                                    <p>Desirable:&gt;5.2 mmol/l</p>
                                                    <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">221</p>
                                                <p className="flex justify-center">mg/dL</p>
                                            </li>
                                        </section>
                                        <section className="py-4 border-t-2 border-black pt-1 mt-1">
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>

                                            <li className="text-[12px] grid grid-cols-3 mt-4">
                                                <div >
                                                    <p>Desirable:&gt;5.2 mmol/l</p>
                                                    <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">221</p>
                                                <p className="flex justify-center">mg/dL</p>
                                            </li>
                                        </section>
                                        <section className="py-4  border-t-2 border-black pt-1 mt-1">
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <b>Cholesterol HDL</b>
                                                </div>
                                                <p className="flex justify-center">&nbsp;</p>
                                                <p className="flex justify-center">&nbsp;</p>
                                            </li>
                                            <li className="text-[12px] grid grid-cols-3 mt-4">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>

                                            <li className="text-[12px] grid grid-cols-3 mt-4">
                                                <div >
                                                    <p>Desirable:&gt;5.2 mmol/l</p>
                                                    <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                </div>
                                                <p className="flex justify-center">5.73</p>
                                                <p className="flex justify-center">mmcl/L</p>
                                            </li>
                                            <li className="text-[12px] grid grid-cols-3">
                                                <div >
                                                    <p>Total Cholesterol</p>
                                                    <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                </div>
                                                <p className="flex justify-center">221</p>
                                                <p className="flex justify-center">mg/dL</p>
                                            </li>
                                        </section>

                                    </ul>
                                </div>

                            </div>
                        </main>
                        <footer id="footer" >
                            <div className="grid grid-cols-[65%_35%] gap-3">
                                <div className="bg-[#121E3F] px-3 py-2 text-white text-[10px]"><p>Thank you for choosing Labtraca. If you have any questions or comments, please email help@labtraca.com or call 0900 000 0000</p></div>
                                <div className="bg-[#121E3F] px-3 py-2 text-white text-center text-[14px] flex justify-center items-center" ><p>+234 9000 000 0000</p></div>
                            </div>
                            <div className="text-[11px] mt-2"><i>RC Number:&nbsp;489766</i></div>
                        </footer>
                    </div>
                </div>
                
                
            </div>  
            }
        </div>
  )
}

// export const Preview = () => {
//     return (
//         <section className="py-4  border-t-2 border-black pt-1 mt-1">
//             <li className="text-[12px] grid grid-cols-3">
//                 <div >
//                     <b>Cholesterol HDL</b>
//                 </div>
//                 <p className="flex justify-center">&nbsp;</p>
//                 <p className="flex justify-center">&nbsp;</p>
//             </li>
//             <li className="text-[12px] grid grid-cols-3 mt-4">
//                 <div >
//                     <p>Total Cholesterol</p>
//                     <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
//                 </div>
//                 <p className="flex justify-center">5.73</p>
//                 <p className="flex justify-center">mmcl/L</p>
//             </li>

//             <li className="text-[12px] grid grid-cols-3 mt-4">
//                 <div >
//                     <p>Desirable:&gt;5.2 mmol/l</p>
//                     <p>Borderline :5.2 - 6.2 mmol/l</p>
//                     <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
//                 </div>
//                 <p className="flex justify-center">5.73</p>
//                 <p className="flex justify-center">mmcl/L</p>
//             </li>
//             <li className="text-[12px] grid grid-cols-3">
//                 <div >
//                     <p>Total Cholesterol</p>
//                     <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
//                 </div>
//                 <p className="flex justify-center">221</p>
//                 <p className="flex justify-center">mg/dL</p>
//             </li>
//         </section>
//     )
// }
export default NewTemplate
