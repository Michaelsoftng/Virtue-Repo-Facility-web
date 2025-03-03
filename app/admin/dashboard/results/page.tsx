/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { getResults } from '@/src/hooks/useGetResultTemplateById'
import { useMutation } from '@apollo/client'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import TablePreloader from '@/src/preLoaders/TablePreloader'
import ResultComponent from '@/src/reuseable/components/ResultComponent'
import RoundedImage from '@/src/partials/RoundedImage'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import Image from 'next/image'
import PDFImage from '@/public/assets/images/utilities/pdf.png'
import { SendResult } from '@/src/graphql/mutations'

const Results = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets] = useState<number>(0);
    const limit = 10;
    const rowsPerPage = 10; // Number of rows per page
    const dataCount = useRef<number>(0);
    const [searchActive, setSearchActive] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const resultdata = useRef<TableData[]>([]);
    const [deleteResultWithId, setDeleteResultWithId] = useState<string | null>(null) // id of result to delete
    const [showResultDetails, setShowResultDetail] = useState<boolean>(false);
    const [activeDataRow, setActiveDataRow] = useState<TableData | null>(null);

    const fetchResults = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: resultsDataLoading } = await getResults(limit, offset);
            if (error) {
                console.log('Error fetching results from api:', error);
                return;
            }
            if (!resultdata.current) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getResultTests?.results) {
                // Update the ref instead of state
                const results = data.getResultTests?.results as TableData[]
                const updateResultsData = results.map((result) => {
                    const {
                        __typename,
                        patient,
                        id,
                        testRequest,
                        requisitionNumber,
                        resultFields,
                        generatedPdfUrl,
                        deletedAt,
                        createdAt,
                        ...rest
                    } = result;

                    const newResultData = {
                        resultId: id,
                        id: testRequest.request.id,
                        ...rest,
                        requisition_number: requisitionNumber,
                        pdf: generatedPdfUrl,
                        result_date: createdAt,
                        generatedPdfUrl,
                        test_name: testRequest.test.name,
                        package_name: testRequest.package ? testRequest.package.packageName : "single",
                        test_description: testRequest.test.description,
                        patients: [null, `${patient.firstName} ${patient.lastName}`, patient.email],   

                    };

                    return newResultData
                }) || [];

                const allResults = [...updateResultsData];
                resultdata.current = Array.from(
                    new Map(
                        [...resultdata.current, ...allResults].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                );
                dataCount.current = data.getResultTests.resultCount;
                setOffsets(offset + limit)
                // offsets = limit + offsets;
            }

        } catch (err) {
            console.log('error fetching results catch error', err);
        } finally {
            setPageLoading(false)
            // console.log("finally")
        }
    }, []);

    function ensureAbsoluteUrl(url: string): string {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return `https://${url}`;
        }
        return url;
    }

    // const handleSearch = useCallback(async (searchTerm: string, limit: number, offset: number) => {
    //     try {
    //         setPageLoading(true)
    //         const { data, error, loading: resultsDataLoading } = await searchResults(searchTerm, limit, offset);
    //         if (error) {
    //             console.log('Error fetching results from api:', error);
    //             return;
    //         }

    //         if (data && data.searchResult?.results) {
    //             // Update the ref instead of state
    //             const results = data.searchResult?.results as TableData[]
    //             const updateResultsData = results.map((result) => {
    //                 const {
    //                     __typename,
    //                     id,
    //                     percentageIncrease,
    //                     minimumIncrease,
    //                     createdAt,
    //                     ...rest
    //                 } = result;

    //                 const newResultData = {
    //                     id,
    //                     ...rest,
    //                     percentage_increase: `${percentageIncrease}%`,
    //                     minimum_increase: minimumIncrease

    //                 };
    //                 return newResultData
    //             }) || [];

    //             const allResults = [...updateResultsData];
    //             // reset result data to an empty array before filling it with search data
    //             if (offset === 0) {
    //                 resultdata.current = []
    //             }
    //             resultdata.current = Array.from(
    //                 new Map(
    //                     [...resultdata.current, ...allResults].map(item => [item.id, item]) // Use `id` to ensure uniqueness
    //                 ).values()
    //             );
    //             dataCount.current = data.searchResult.resultCount;
    //             setOffsets(offset + limit)
    //             // offsets = limit + offsets;
    //         }

    //     } catch (err) {
    //         console.log('error fetching results catch error', err);
    //     } finally {
    //         setPageLoading(false)
    //     }
    // }, []);

    // const handleSearchData = (searchTerm: string) => {
    //     setOffsets(0)
    //     setSearchActive(true)
    //     setSearchTerm(searchTerm)
    //     handleSearch(searchTerm, limit, 0);
    // }

    // const handleFetchNextPage = () => {
    //     if (searchActive) {
    //         if (resultdata.current.length < (limit * (currentPage + 1))) {
    //             handleSearch(searchTerm, limit, offsets);
    //         }
    //     } else {
    //         if (resultdata.current.length < (limit * (currentPage + 1))) {
    //             fetchResults(limit, offsets);
    //         }
    //         return;
    //     }
    // }


    function getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    console.log(getRandomInt(1, 10)); // Example: 3 (between 1 and 10)

    useEffect(() => {
        fetchResults(limit, 0);
    }, [fetchResults, limit]);

    const handleShowResult = (data: TableData) => {
        setShowResultDetail(true)
        setActiveDataRow(data)
    }
    
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };
    // Filter the data based on the search term
    const filteredData = resultdata.current.filter((row) => {
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
        if (resultdata.current.length < (limit * (currentPage + 1))) {
            fetchResults(limit, offsets);
        }
        return;

    }
    function formatISODate(isoString: string): {date: string, time:string} {
        const date = new Date(isoString);

        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const formattedDate = dateFormatter.format(date);
        const formattedTime = timeFormatter.format(date);

        return { date: formattedDate, time:formattedTime };
    }

    const isoString = "2024-09-18T09:45:00Z";
    if (activeDataRow) {
        console.log(formatISODate(isoString));
    }
    
    const [SendTestResult] = useMutation(SendResult, {
        client,
    });

    const handleSendResult = async (e: React.FormEvent) => {

        e.preventDefault();
        setPageLoading(true);
        try {
            await SendTestResult({
                variables: {
                    resultId: activeDataRow!.resultId
                },
                onCompleted(data) {
                    if (data.SendResult.error) {
                        toast.error('An error occured could not send test result');
                    } else {
                        toast.success('Test result sent successfully');  
                    }
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error creating user:', err);
        } finally {
            setPageLoading(false);
        }
    };
    
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Results" showExportRecord={false} />
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
                            {pageLoading ? <TablePreloader /> : (
                                <div className={`grid gap-y-6 justify-between mt-6 ${showResultDetails ? 'grid-cols-4' : 'grid-cols-5'}`}>
                                    {resultdata.current.map((row, index) => (
                                            <Link href='' key={row.id}> <ResultComponent key={index} data={row} onClick={handleShowResult} /> </Link>
                                        ))
                                    }
                              
                                </div>)
                            }
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
                                            <p className="text-[#525C76] text-[16px] font-semibold">{activeDataRow.test_name}</p>
                                            <p className="font-semibold bg-[#E2E4E8] border-2 border-[#7584aa54] text-[#8C93A3] w-[150px] text-center mt-2 py-1 rounded">{activeDataRow.package_name}</p>
                                            <div className="mt-5 ">
                                                <h2 className="font-bold text-[#525C76] text-lg">Date uploaded</h2>
                                                <p className="text-[#8C93A3] flex justify-between text-[14px] mt-2">
                                                    <span>{formatISODate(activeDataRow.result_date).date}</span>
                                                    <span>{formatISODate(activeDataRow.result_date).time}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-14">
                                            <h2 className="text-[#0F1D40] font-bold">Description</h2>
                                            <p className="text-[#8C93A3] flex justify-between text-[14px] mt-2 tracking-wider">{activeDataRow.restest_description}
                                            </p>
                                        </div>
                                        <div className="mt-10">
                                            <h2 className='text-[#0F1D40] font-bold'>File</h2>
                                            <div className="mt-4">
                                                <Link href={ensureAbsoluteUrl(activeDataRow.generatedPdfUrl)} rel="noopener noreferrer" target="_blank">
                                                    <div className="flex justify-between mt-4 ">
                                                        <div className="flex gap-4">
                                                            <Image src={PDFImage} alt='' width={35} />
                                                            <p className='mt-1 text-[#08AC85] font-medium'>{activeDataRow.requisition_number}.pdf</p>
                                                        </div>
                                                        <p className="text-[#8C93A3]">{getRandomInt(200, 300)}kb</p>
                                                    </div>
                                                </Link>
                                                
                                                
                                            </div>
                                        </div>
                                        <div className="my-8">
                                            <button className="bg-[#08AC85] text-white text-center w-full py-4 font-bold text-lgrounded" onClick={handleSendResult}>Send result</button>
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

export default Results
