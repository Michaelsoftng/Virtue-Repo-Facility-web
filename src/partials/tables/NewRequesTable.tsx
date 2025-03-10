/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { ChangeEvent, useState } from 'react';
import { TableData } from '@/src/types/TableData.type';
import RoundedImage from '../RoundedImage';
import RoundedNoImage from '../RoundedNoImage';
import '@/public/assets/css/custom.css';
import  PlusIcon from '../../reuseable/icons/PlusIcon';
import EditTestModal from '@/src/reuseable/components/EditTestModal';
import AddTestModal from '@/src/reuseable/components/AddTestModal';
import ConfirmDeleteModal from '@/src/reuseable/components/DeleteTestModal';
import { formatWord } from './AdminFacilitiesTable';
import AddTestToFacility from '@/src/reuseable/components/AddTestToFacility';
import Link from 'next/link';
import EditFacilityTestModal from '@/src/reuseable/components/EditFacilityTestModal';
import AddPackageToFacility from '@/src/reuseable/components/AddPackageToFacility';
import EditFacilityPackageModal from '@/src/reuseable/components/EditFacilityPackageModal';

export interface TestModalProps{
    id?: string
    test?: string
    code?: string
    description?: string | null
    name?: string
    test_type?: string;
    group?: string;
    normal_range?: string;
    unit?: string;
    preparation?: string;
    methodology?: string;
    duration?: string;
    percentage_increase?: number | string;
    minimum_increase?: number;
}

export interface PackageModalProps {
    id?: string
    facility?: string
    amount?: string;
    test_package?: string;
    package_name?: string
    description?: string | null
    percentage_increase?: number | string;
    minimum_increase?: number;
}

export interface FacilityTestProps {
    id?: string;
    test?: string;
    amount?: string;
    duration?: string;
    preparation?: string;

}
export type NewRequestTableProps = {
    pageHeader?: string,
    tableData: TableData[];
    searchBoxPosition: string,
    tableHeadText: string,
    showTableHeadDetails: boolean,
    showActions: boolean
    activeTab: string,
    setActiveTab: (tab: string) => void
    testPage?: string
    facilityId?: string,
    changePage: () => void
    dataCount?: number,
    currentPage: number;
    setCurrentPage: (page: number) => void;
    viewMoreAction?: () => void,
    deleteAction: () => void
    setItemToDelete: (id: string) => void
    handleSearchData: (searchTerm: string) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approveAction: (data?: any) => void,
};

const colorCombination = [
    'bg-red-500 text-white',
    'bg-blue-800 text-yellow-500',
    'bg-yellow-500 text-black',
    'bg-green-500 text-white',
];

export function formatMoney(amount: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
}
function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-GB'); // 12/10/1990 format (dd/mm/yyyy)

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedTime = date.toLocaleTimeString('en-US', options); // 09:45 am format

    return `${formattedDate} ${formattedTime}`;
}

const NewRequestTable: React.FC<NewRequestTableProps> = (
    { pageHeader,
        tableData,
        searchBoxPosition,
        showTableHeadDetails,
        tableHeadText,
        showActions,
        activeTab,
        setActiveTab,
        testPage,
        facilityId,
        approveAction,
        dataCount,
        changePage,
        currentPage,
        setCurrentPage,
        viewMoreAction,
        deleteAction,
        setItemToDelete,
        handleSearchData,

        // 

    }) => {
    console.log({tableData})
    const [searchTerm, setSearchTerm] = useState<string>('');
    // const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 10; 
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
    const [showEditPackageModal, setShowEditPackageModal] = useState<boolean>(false);
    // const [activeDataId, setActiveDataId] = useState<string | null>(null);
    const [activeData, setActiveData] = useState<TestModalProps | null>(null)
    const [activeFacilityTestData, setActiveFacilityTestData] = useState<FacilityTestProps | null>(null)
    const [activePackageData, setActivePackageData] = useState<PackageModalProps | null>(null)
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    // Filter the data based on the search term
    const filteredData = tableData.filter((row) => {
        return Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleDelete = () => {
        setShowDeleteModal(false)
        deleteAction()

    }

    const handleSearch = () => {
        handleSearchData(searchTerm)
    }

    const totalPages = Math.ceil(dataCount as number / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // console.log('filtered Data', filteredData.length);
  
    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            changePage()
            setCurrentPage(currentPage + 1);
        }
    };

    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const showModalFunc = (dataIndex: number, modalType: string, id?: string) => {
        const dataToDisplay2 = tableData[dataIndex]
        const dataToDisplay = tableData.find(item => item.id === dataIndex);
        switch (modalType) {
            case 'edit':
                setShowEditModal(true)
                setActiveFacilityTestData(dataToDisplay2)
                break;
            case 'editFacilityTest':
                setShowEditModal(true)
                setActiveFacilityTestData(dataToDisplay2)
                break;
            case 'editFacilityPackage':
                setShowEditPackageModal(true)
                setActivePackageData(dataToDisplay2)
                break;
            case 'remove':
                setItemToDelete(id as string)
                setShowDeleteModal(true)
                break;
            case 'addTest':
                setActiveData(dataToDisplay as unknown as TestModalProps)
                setShowAddModal(true)
                break;
            case 'addPackage':
                setActiveData(dataToDisplay as unknown as PackageModalProps)
                setShowAddPackageModal(true)
                break;
                
            default:
                break;
        }
    }
    return (
        <div className="mt-[-20px] container mx-auto ">
            <div className={`mt-8 flex justify-between  mb-4`}>
                <div>
                    <h2 className="text-lg font-bold">{tableHeadText }</h2>
                </div>
                
                <div className={`flex  ${searchBoxPosition ? searchBoxPosition : "justify-end"} `}>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-[300px] px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-inset focus:ring-[#1b6d9c]"
                    />
                    <button onClickCapture={handleSearch} className="bg-green-700 text-white px-4 py-1 rounded-r-lg">Go</button>
                </div>
            </div>

    
            <div className="overflow-x-auto shadow-md w-full pr-4 rounded-lg bg-white">
                {
                    showTableHeadDetails && 
                    <div className="flex justify-between px-6 py-4">
                        {
                            activeTab === 'availableTest'
                            ?
                            <>
                                <h2 className="text-[#0F1D40] font-bold text-2xl">Avalable test</h2>

                                <button onClick={() => setActiveTab('facilityTest')} className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                    <span>back to facility Test</span>

                                </button>
                            </>
                            :
                            <>
                                <h2 className="text-[#0F1D40] font-bold text-2xl">{pageHeader ? pageHeader : 'Facility test'}</h2>

                                <button onClick={() => setActiveTab('availableTest')} className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                    <PlusIcon />
                                    <span>Add Test</span>

                                </button>
                            </>        
                        }
                        
                    </div>
                }
                {tableData.length == 0
                    ?
                    <div className="w-full text-center flex justify-center  text-black font-semibold text-2xl  shadow-md h-[300px] pr-4 rounded-lg bg-white"> <p className="mt-[130px]">No data to show</p></div>
                    :
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-thin">
                                    <div>
                                        <span className="text-[#434D64]">S/N</span>
                                    </div>
                                </td>
                                {columns.map((column) =>
                                    column === 'id' ? null : (
                                        <th
                                            key={column}
                                            className="px-6 py-8 capitalize whitespace-nowrap border-gray-400 text-left text-sm leading-4 text-black tracking-wider"
                                        >
                                            {formatWord(column)}
                                        </th>
                                    )
                                )}
                                {showActions && (
                                    <th
                                        key="actions"
                                        className="px-6 py-8 capitalize whitespace-nowrap border-gray-400 text-left text-sm leading-4 text-black tracking-wider"
                                    >
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row, index) => (
                                <tr key={index} className="border-solid border-2">
                                    <td key={index} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-thin">
                                        <div>
                                            <span className="text-[#434D64]">{index + 1}</span>
                                        </div>
                                    </td>
                                    {columns.map((column) => {
                                        switch (column) {
                                            case 'patient':
                                            case 'patients':
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-light">
                                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                            <div>
                                                                {row[column][0] ? (
                                                                    <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                                ) : (
                                                                    <RoundedNoImage
                                                                        text={row[column][1]
                                                                            .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                            .join('')}
                                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-[#231935bd]">
                                                                {row[column][1]}
                                                                <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            case 'amount':
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-thin">
                                                        <div>
                                                            <span className="text-[#434D64]">{formatMoney(row[column])}</span>
                                                        </div>
                                                    </td>
                                                );
                                            case 'phlebotomist':
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm ">
                                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                            <div>
                                                                {row[column][0] ? (
                                                                    <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                                ) : (
                                                                    <RoundedNoImage
                                                                        text={row[column][1]
                                                                            .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                            .join('')}
                                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-[#231935bd]">
                                                                {row[column][1]}
                                                                <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            case 'request_date':
                                            case 'date':
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-center text-md capitalize px-2 py-2 rounded font-thin">
                                                            {formatDateTime(row[column])}
                                                        </span>
                                                    </td>
                                                );
                                            case 'sample_status':
                                            case 'result_status':
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap overflow-scroll border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column]}
                                                        </span>
                                                    </td>
                                                );
                                            case 'id':
                                                break;
                                            default:
                                                return (
                                                    <td key={column} className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-[#434D64]">{row[column]}</span>
                                                    </td>
                                                );
                                        }
                                    })}
                                    {showActions && (
                                    
                                        <td key="actions" className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm">
                                            {testPage === 'facilityTest' &&
                                               
                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]" onClick={() => showModalFunc(index, 'editFacilityTest')}>Edit</button>
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(row.id, 'remove', row.id)}>Remove</button>
                                                </div>
                                              
                                            }

                                            {testPage === 'facilityPackage' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]" onClick={() => showModalFunc(index, 'editFacilityPackage')}>Edit</button>
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(row.id, 'remove', row.id)}>Remove</button>
                                                </div>

                                            }


                                            {(testPage === 'requests' || testPage === 'payments') &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <Link href={`requests/${row.id}`} className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]">View</Link>
                                                </div>
                                            }
                                            {(testPage === 'availableTest') &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#08AC85] rounded text-[#08AC85]" onClick={() => showModalFunc(row.id, 'addTest')}>Add test to facility</button>
                                                </div>
                                            }

                                            {(testPage === 'availablePackage') &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#08AC85] rounded text-[#08AC85]" onClick={() => showModalFunc(row.id, 'addPackage')}>Add package to facility</button>
                                                </div>
                                            }
                                            
                                            {/* :
                                            <div className="flex justify-between gap-2 w-[150px]">
                                                <button className="px-4 py-1 border-2 border-[#08AC85] rounded text-[#08AC85]" onClick={() => showModalFunc(index, 'addTest')}>Add test to facility</button>
                                            </div> */}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4 w-full">
                <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[#b5b5b6] text-[#b5b5b6]"
                >
                    Previous
                </button>

                <p>page {currentPage} of {totalPages}</p>
                <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg border-[#6b6a6a] text-[#6b6a6a]"
                >
                    Next
                </button>
            </div>

            
            <EditFacilityTestModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} test={activeFacilityTestData} handleEditTest={approveAction} />
            
            <EditFacilityPackageModal isOpen={showEditPackageModal} onClose={() => setShowEditPackageModal(false)} packages={activePackageData} handleEditTest={approveAction} />

            {/* <EditTestModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} test={activeFacilityTestData} handleEditTest={()=>{}} /> */}
            {/* <AddTestModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} modalDetails={activeData} /> */}
            <AddPackageToFacility handleSubmitFacilityTest={approveAction} isOpen={showAddPackageModal} onClose={() => setShowAddPackageModal(false)} packages={activeData} facilityId={facilityId as string} />
            <AddTestToFacility handleSubmitFacilityTest={approveAction} isOpen={showAddModal} onClose={() => setShowAddModal(false)} test={activeData} facilityId={facilityId as string} />
            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} />
        </div>
    );
};

export default NewRequestTable;



