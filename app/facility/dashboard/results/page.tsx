/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import ResultComponent from '@/src/reuseable/components/ResultComponent'
import RoundedImage from '@/src/partials/RoundedImage'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import Image from 'next/image'
import PDFImage from '@/public/assets/images/utilities/pdf.png'
import { GetResults } from '@/src/graphql/queries'
import { getResults } from '@/src/hooks/useGetResultTemplateById'
import { toast } from 'react-toastify'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import Link from 'next/link'

const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        size: '7mb',
        files: 3,
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        size: '4mb',
        files: 3,
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        size: '1mb',
        files: 1,
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        size: '17mb',
        files: 3,
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        size: '17mb',
        files: 3,
    },
    {
    	patients: ['male.jpg', 'Linda Thomas', 'lindathomas@example.com'],
        size: '7mb',
        files: 3,
    },
    {
    	patients: ['female.jpg', 'Steve Martin', 'stevemartin@example.com'],
        size: '7mb',
        files: 3,
    },
    {
    	patients: ['male.jpg', 'Emily Davis', 'emilydavis@example.com'],
        size: '7mb',
        files: 3,
    },
    {
    	patients: ['female.jpg', 'Daniel Taylor', 'danieltaylor@example.com'],
        size: '7mb',
        files: 3,
    },
    {
    	patients: ['male.jpg', 'Sarah King', 'sarahking@example.com'],
        size: '7mb',
        files: 3,
    }
];
const Requests = () => {
    // const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 10; // Number of rows per page
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showResultDetails, setShowResultDetail] = useState<boolean>(false);
    const [activeDataRow, setActiveDataRow] = useState<TableData | null>(null);
    const [offsets, setOffsets] = useState<number>(0);
    const limit = 10;
    const dataCount = useRef<number>(0);
    const [resultLoading, setResultLoading] = useState(false)
    const result = useRef<TableData[]>([]);

    const fetchResults = useCallback(async (limit: number, offset: number) => {
        try {
            setResultLoading(true)
            const { data, error } = await getResults( limit, offset);
            if (error) {
                throw new Error(error.message);
            }

            if (!result.current) {
                console.log("invalid ref for data.current")
            }

            if (data && data.getResultTests?.results) {
                // Update the ref instead of state
                const resultsData = data.getResultTests?.results as TableData[]
                const updatedResultData = resultsData?.map((singleResult) => {

                    const {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        id,
                        patient,
                        generatedPdfUrl,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ...rest
                    } = singleResult;

                    const newResultData = {
                        id,
                        generatedPdfUrl,
                        patients: [null, `${patient.firstName} ${patient.lastName}`, patient.email],   
                    };

                    return newResultData
                }) || []; // Default to an empty array if patientData is undefined

                console.log('updatedResultData', updatedResultData);
                const allTestResults = [...updatedResultData];
                result.current = Array.from(
                    new Map(
                        [...result.current, ...allTestResults].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                );
                dataCount.current = data.getUserByUserType.usersCount;
                setOffsets(offset + limit)
                // offsets = limit + offsets;
            }

        } catch (err) {
            toast.error('Error fetching tests');
            console.log('error fetching tests catch error', err);
        } finally {
            setResultLoading(false)
        }
    }, []);

    const handleShowResult = (data: TableData) => {
        setShowResultDetail(true)
        setActiveDataRow(data)
    }
    
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    // Filter the data based on the search term
    const filteredData = sampleCompletedData.filter((row) => {
        return Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const colorCombination = [
        'bg-red-500 text-white',
        'bg-blue-800 text-yellow-500',
        'bg-yellow-500 text-black',
        'bg-green-500 text-white',
    ];
    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFetchNextPage = () => {
       if (result.current.length < (limit * (currentPage + 1))) {
            fetchResults(limit, offsets);
        }
        return;
        
    }

    useEffect(() => {
        fetchResults(limit, 0);
    }, [fetchResults, limit]);
    
    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="requests" showExportRecord={false} />
                    <div className={`grid ${showResultDetails ? 'grid-cols-[72%_28%]' : ''}`}>
                        <div className="px-8 py-4">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Result files</h2>
                                </div>
                                {/* <div className={`flex justify-end `}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-inset focus:ring-[#1b6d9c]"
                                    />
                                    
                                </div> */}

                            </div>
                            <div className={`grid gap-y-6 justify-between mt-6 ${showResultDetails ? 'grid-cols-4' : 'grid-cols-5'}`}>
                                {resultLoading ? <TablePreloader /> :
                                   (
                                        result.current.map((row, index) => (
                                            <Link href='' key={row.id}> <ResultComponent key={index} data={row} onClick={handleShowResult} /> </Link>
                                        ))
                                    )
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
                                <button
                                    onClick={() => handlePageChange('next')}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded-lg border-[#6b6a6a] text-[#6b6a6a]"
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                        {
                            activeDataRow === null ? ''
                                : (
                                <div className={` shadow-md pl-6 pr-3 bg-white ${showResultDetails ? 'block' : 'hidden'}`}>
                                    <div className="mt-4 py-2 flex justify-between items-center ">
                                        <div>
                                            <h3 className="text-black text-xl  font-semibold generalSans">
                                                Test information
                                            </h3>
                                        </div>

                                        <button
                                            onClick={() => { }}
                                            className="text-[#525c7691] font-thin text-3xl border px-2 py-0 rounded"
                                        >
                                            &times; {/* Close button icon */}
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                            <div>
                                                {activeDataRow.patients[0] ? (
                                                    <RoundedImage userimage={activeDataRow.patients[0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                ) : (
                                                    <RoundedNoImage
                                                        text={activeDataRow.patients[1]
                                                            .split(' ')
                                                            .map((word: string) => word[0].toUpperCase())
                                                            .join('')}
                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                    />
                                                )}
                                            </div>
                                            <div className="">
                                                <p className="text-black font-medium text-[16px]">{activeDataRow.patients[1]}</p>
                                                <p className="text-[#8C93A3] flex justify-between text-[14px]  tracking-wider">{activeDataRow.patients[2]}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                            <p className="text-[#525C76] text-[16px] font-semibold">COVID 19 Qualitative Prc throat swab</p>
                                            <p className="font-semibold bg-[#E2E4E8] border-2 border-[#7584aa54] text-[#8C93A3] w-[150px] text-center mt-2 py-1 rounded">Single, 3 persons</p>
                                        <div className="mt-5 ">
                                            <h2 className="font-bold text-[#525C76] text-lg">Date uploaded</h2>
                                            <p className="text-[#8C93A3] flex justify-between text-[14px] mt-2">
                                                <span>18 September 2024</span>
                                                <span>09:45 AM</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-14">
                                        <h2 className="text-[#0F1D40] font-bold">Description</h2>
                                        <p className="text-[#8C93A3] flex justify-between text-[14px] mt-2 tracking-wider">Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit.
                                            Vestibulum libero risus, consectetur
                                            non erat vitae, iaculis vulputate sem.
                                            Interdum et malesuada.
                                        </p>
                                    </div>
                                    <div className="mt-10">
                                        <h2 className='text-[#0F1D40] font-bold'>File</h2>
                                        <div className="mt-4">
                                            <div className="flex justify-between mt-4 ">
                                                <div className="flex gap-4">
                                                    <Image src={PDFImage} alt='' width={35}/>
                                                        <p className='mt-1 text-[#08AC85] font-medium'>file123.pdf</p>
                                                </div> 
                                                    <p className="text-[#8C93A3]">256kb</p>
                                            </div>
                                            <div className="flex justify-between mt-4">
                                                <div className="flex gap-4">
                                                    <Image src={PDFImage} alt='' width={35}/>
                                                        <p className='mt-1 text-[#08AC85] font-medium'>file123.pdf</p>
                                                </div> 
                                                    <p className="text-[#8C93A3]">256kb</p>
                                            </div>
                                            <div className="flex justify-between mt-4">
                                                <div className="flex gap-4">
                                                    <Image src={PDFImage} alt='' width={35}/>
                                                        <p className='mt-1 text-[#08AC85] font-medium'>file123.pdf</p>
                                                </div> 
                                                    <p className="text-[#8C93A3]">256kb</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-8">
                                        <button className="bg-[#08AC85] text-white text-center w-full py-4 font-bold text-lgrounded">Send result</button>
                                    </div>
                                </div>
                                )
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Requests
