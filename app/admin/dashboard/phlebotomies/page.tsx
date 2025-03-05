/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { getUsersByType, SearchUsersByType } from '@/src/hooks/useGetUsersByType'
import { getAllAssignments } from '@/src/hooks/useGetAllAssignments'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import BarChartYaxis from '@/src/partials/BarChartYaxis'



const Phlebotomies = () => {
    const limit = 10;  
    const [currentPhlebPage, setPhlebCurrentPage] = useState<number>(1);
    const [currentAssignmentPage, setAssignmentCurrentPage] = useState<number>(1);
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const [loading, setLoading] = useState(false)
    const [staffWithId, setStafftWithId] = useState<string | null>(null) // id of staff to delete
    const { user } = useAuth()
    const Id = user?.id
    const verifiedUsers = useRef<number>(0)
    const newStaffs = useRef<number>(0)
    const unverifedStaffs = useRef<number>(0)
    const [activeTab, setActiveTab] = useState<string>("phlebotomist")
    const [offsets, setOffsets]  = useState<{ [key: string]: number }>({
            phlebotomies: 0,
            audits: 0,
            assignments: 0,
        });
    const [searchActive, setSearchActive] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dataCount = useRef<{ [key: string]: number}>({
            phlebotomies: 0,
            audits: 0,
            assignments: 0,
        });
    
    const datas = useRef<{ [key: string]: TableData[]  }>({
        phlebotomies: [],
        audits: [],
        assignments: [],
    });

    const fetchPhlebotomies = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data, error, loading: testsDataLoading } = await getUsersByType('phlebotomist', limit, offset);
            if (error) {
                console.log('Error fetching users from api:', error);
                return;
            }
            if (data && data.getUserByUserType?.users) {
                // Update the ref instead of state
                const phlebotomies = data.getUserByUserType?.users as TableData[]
                const updatedPhlebotomiesData = phlebotomies?.map((singleStaff) => {

                    const {
                        id,
                        __typename,
                        approvalToken,
                        approvedAt,
                        referralCode,
                        referralBonus,
                        facilityAdmin,
                        doctor,
                        phlebotomist,
                        staff,
                        firstName,
                        streetAddress,
                        streetAddress2,
                        lastName,
                        email,
                        patient,
                        country,
                        postal,
                        city,
                        state,
                        latitude,
                        longitude,
                        emailVerifiedAt,
                        deletedAt,
                        deletedBy,
                        createdAt,
                        ...rest
                    } = singleStaff;

                    if (emailVerifiedAt) {
                        verifiedUsers.current += 1;
                    } else {
                        unverifedStaffs.current += 1;
                    }
                    const name = (firstName && lastName) ? `${firstName.trim()} ${lastName.trim()}` : 'Not Set'
                    const active = emailVerifiedAt ? 'verified' : 'unverified'
                    const status = approvedAt ? 'approved' : 'pending approval'
                    const patientCity = city ? city : 'Not set'
                    const patientState = state ? state : 'Not set'
                    const activity = deletedAt ? "deleted" : "active"
                    const createdDate = new Date(createdAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    if (createdDate >= oneWeekAgo) {
                        newStaffs.current += 1;
                    }
                    const newPatientData = {
                        id,
                        phlebotomist: [null, name, singleStaff.email],
                        ...rest,
                        city: patientCity,
                        state: patientState,
                        verified: active,
                        status: status,
                        is_active: activity,
                        approved_at: approvedAt ? new Date(approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not approved'
                    };

                    return newPatientData
                }) || [];

                const allPhlebotomies = [...updatedPhlebotomiesData];

                datas.current = {
                    ...datas.current,
                    phlebotomies: Array.from(
                        new Map(
                            [...datas.current.phlebotomies, ...allPhlebotomies].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                dataCount.current = {
                    ...dataCount.current,
                    phlebotomies: data.getUserByUserType.usersCount
                };
                
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    phlebotomies: prevOffsets.phlebotomies + limit,
                }));

            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setLoading(false)

        }
    }, []);

    const handleSearch = useCallback(async (searchTerm: string,  limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data, error, loading: testsDataLoading } = await SearchUsersByType(searchTerm, 'phlebotomist', limit, offset);
            
            if (error) {
                console.log('Error fetching tests from api:', error);
                return;
            }
            
            if (data && data.searchUsers?.users) {
                
                const phlebotomies = data.getUserByUserType?.users as TableData[]
                const updatedPhlebotomiesData = phlebotomies?.map((singleStaff) => {

                    const {
                        id,
                        __typename,
                        approvalToken,
                        approvedAt,
                        referralCode,
                        referralBonus,
                        facilityAdmin,
                        doctor,
                        phlebotomist,
                        staff,
                        firstName,
                        streetAddress,
                        streetAddress2,
                        lastName,
                        email,
                        patient,
                        country,
                        postal,
                        city,
                        state,
                        latitude,
                        longitude,
                        emailVerifiedAt,
                        deletedAt,
                        deletedBy,
                        createdAt,
                        ...rest
                    } = singleStaff;


                    const name = (firstName && lastName) ? `${firstName} ${lastName}` : 'Not Set'
                    const active = emailVerifiedAt ? 'verified' : 'unverified'
                    const status = approvedAt ? 'approved' : 'pending approval'
                    const patientCity = city ? city : 'Not set'
                    const patientState = state ? state : 'Not set'
                    const activity = deletedAt ? "deleted" : "active"
                   
                   
                    const newPatientData = {
                        id,
                        phlebotomist: [null, name, singleStaff.email],
                        ...rest,
                        city: patientCity,
                        state: patientState,
                        verified: active,
                        status: status,
                        is_active: activity,
                        approved_at: approvedAt ? new Date(approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not approved'
                    };

                    return newPatientData
                }) || [];


                const allPhlebotomies = [...updatedPhlebotomiesData];
                // reset test data to an empty array before filling it with search data
                if (offset === 0) {
                    datas.current.phlebotomies =[]  
                }

                datas.current = {
                    ...datas.current,
                    phlebotomies: Array.from(
                        new Map(
                            [...datas.current.phlebotomies, ...allPhlebotomies].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                dataCount.current = {
                    ...dataCount.current,
                    phlebotomies: data.searchUsers.usersCount
                };
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    phlebotomies: prevOffsets.phlebotomies + limit, // Update the key you want
                }));
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setLoading(false)
        }
    }, []);
    const handleSearchData = (searchTerm: string) => {
        setOffsets((prevOffsets) => ({
            ...prevOffsets,
            phlebotomies: 0, 
        }));
        setSearchActive(true)
        setSearchTerm(searchTerm)
        handleSearch(searchTerm, limit, 0);
    }
    const [approveStaff, { loading: approveStaffLoading }] = useMutation(ApproveAccount, {
        variables: {
            userForApproval: staffWithId,
            approvingAdmin: decodeJwtEncodedId(user?.id as string),

        },
        client,
    });

    const handleApproveStaff = async () => {
        setLoading(true)
        try {
            const { data } = await approveStaff({
                variables: {
                    userForApproval: staffWithId,
                    approvingAdmin: decodeJwtEncodedId(Id as string), // Pass decoded ID here
                },
                async onCompleted(data) {
                    if (data.ApproveAccount.success) {
                        toast.success(data?.ApproveAccount?.success?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.ApproveAccount?.errors?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error approving account:', err);
        } finally {
            setLoading(false)

        }

    }

    const [deleteStaff, { loading: deleteTestLoading }] = useMutation(DeleteUser, {
        variables: {
            id: staffWithId,

        },
        client,
    });

    const handleDeleteTest = async () => {
        console.log(staffWithId)
        setLoading(true)
        try {
            const { data } = await deleteStaff({
                async onCompleted(data) {
                    console.log(data)
                    if (data.DeleteUser.deleted) {
                        toast.success(data.DeleteUser.deleted);
                        window.location.reload();
                    } else {
                        toast.error(data.DeleteUser.errors.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error deleting test:', err);
        } finally {
            setLoading(false)

        }

    }

    const fetchAssignments = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data, error, loading: assignmentDataLoading } = await getAllAssignments(limit, offset);
            if (error) {
                console.log('Error fetching assignments:', error);
                return;
            }
            if (data && data.getAllAssignment?.assignments) {
                // Update the ref instead of state
                const assignments = data.getAllAssignment?.assignments as TableData[] 
                const updateAssignmentsData = assignments.map((assignment) => {
               
                    const {
                        id,
                        __typename,
                        taskObjectId,
                        distance,
                        assignmentDate,
                        lastAssignmentTime,
                        potentialEarning,
                        request,
                        assignedBy,
                        assigned,
                        isAccepted,
                        createdAt,
                        ...rest
                    } = assignment;

                    const newAssignmentData = {
                        id,
                        ...rest,
                        
                        assigned_to: [null, `${assigned.firstName} ${assigned.lastName}`, assigned.email],
                        potential_Earning: potentialEarning,
                        assignment_Date: new Date(assignmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                        last_assigned: new Date(lastAssignmentTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                        status: isAccepted ? 'accepted' : 'pending',
                    };
                    
                    return newAssignmentData
                }) || [];
            const allAssignments = [...updateAssignmentsData];
                datas.current = {
                    ...datas.current,
                    assignments: Array.from(
                        new Map(
                            [...datas.current.assignments, ...allAssignments].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                dataCount.current = {
                    ...dataCount.current,
                    assignments: data.getAllAssignment?.assignmentsCount,
                };

                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    assignments: prevOffsets.assignments + limit, // Update the key you want
                }));

        
            }
        } catch (err) {
            console.log('Error fetching cachedSavedJobsRef.current saved jobs:', err);
        } finally {
            setLoading(false)
            console.log("finally")
        }
    }, []);

    const handleTabChange = (tab: string) => {
        switch (tab) {
            case 'assignment':
                setActiveTab('assignment')
                fetchAssignments(10, offsets.assignments)
                break;
        
            default:
                break;
        }
        
    }

    const handleFetchPhlebNextPage = () => {
       if (searchActive) {
            if (datas.current.phlebotomies.length < (limit * (currentPhlebPage + 1))) {
                handleSearch(searchTerm, limit, offsets.phlebotomies);
            }
        } else {
            if (datas.current.phlebotomies.length < (limit * (currentPhlebPage + 1))) {
                fetchPhlebotomies(limit, offsets.phlebotomies);
            }
            return;
        }

    }

    const handleFetchAssignmentNextPage = () => {
        if (datas.current.phlebotomies.length < (limit * (currentAssignmentPage + 1))) {
            fetchAssignments(limit, offsets.assignments);
        }
        return;

    }

    useEffect(() => {
        fetchPhlebotomies(limit, 0);
    }, [fetchPhlebotomies, limit]);

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Phlebotomies" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'phlebotomist' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646]"}  w-[200px] rounded`} onClick={() => setActiveTab('phlebotomist')}>Phlebotomist</button>
                            <button className={`px-4 py-2 ${activeTab === 'audit' ? " bg-[#B2B7C2]" : "bg-[#b5b5b646] "} w-[200px] rounded`} onClick={() => setActiveTab('audit')}>Audit</button>
                            <button className={`px-4 py-2 ${activeTab === 'assignment' ? " bg-[#B2B7C2]" : "bg-[#b5b5b646] "} w-[200px] rounded`} onClick={() => handleTabChange('assignment')}>assignment</button>

                        </div>
                        <div className="">
                            {loading

                                ?
                                'loading'
                                :
                                <TotalPatients
                                    loading={loading}
                                    totalusers={dataCount.current.phlebotomies}
                                    newUsers={newStaffs.current}
                                    verifiedUsers={verifiedUsers.current}
                                    unverifedPatients={unverifedStaffs.current}
                                    type="phlebotomies"
                                />
                            }

                            {activeTab === 'phlebotomist' && (
                                
                                loading

                                ?
                                <TablePreloader />
                                :
                                    <AdminFacilitiesTable
                                    handleSearchData={handleSearchData}
                                    currentPage={currentPhlebPage}
                                    setCurrentPage={setPhlebCurrentPage}
                                    deleteAction={handleDeleteTest}
                                    approveAction={handleApproveStaff}
                                    setItemToDelete={setStafftWithId}
                                    changePage={handleFetchPhlebNextPage}
                                    tableHeadText={`Phlebotomies ${dataCount.current.phlebotomies}`}
                                    tableData={datas.current.phlebotomies}
                                    dataCount={dataCount.current.phlebotomies}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='phlebotomies'
                                    marginTop='mt-4'
                                    />
                            )
                            }

                            {activeTab === 'audit' && (
                                <div className="mt-6">
                                    <BarChartYaxis />
                                    {loading ? (
                                        <TablePreloader />
                                    ) : (
                                        <AdminFacilitiesTable
                                            handleSearchData={handleSearchData}
                                            currentPage={1}
                                            setCurrentPage={() => { }}
                                            deleteAction={handleDeleteTest}
                                            approveAction={handleApproveStaff}
                                            setItemToDelete={setStafftWithId}
                                            changePage={() => { }}
                                            tableHeadText=""
                                            tableData={datas.current.phlebotomies}
                                            searchBoxPosition="justify-start"
                                            showTableHeadDetails={true}
                                            showActions={true}
                                            showPagination={true}
                                            testPage="phlebotomies"
                                            marginTop="mt-4"
                                            >
                                            <div className="mx-4 mt-6">
                                                <h2 className="text-[#0F1D40] font-bold text-xl">Inventory Remaining</h2>
                                                <p className="text-sm text-[#8C93A3]">Allocated inventory remaining to phlebotomist</p>
                                              
                                            </div>
                                        </AdminFacilitiesTable>
                                    
                                    )}
                                </div>
                            )}



                            {activeTab === 'assignment' && (

                                loading
                                ?
                                <TablePreloader />
                                :
                                <AdminFacilitiesTable
                                    handleSearchData={()=>{}}
                                    currentPage={currentAssignmentPage}
                                    setCurrentPage={setAssignmentCurrentPage}
                                    deleteAction={handleDeleteTest}
                                    approveAction={handleApproveStaff}
                                    setItemToDelete={setStafftWithId}
                                    changePage={handleFetchAssignmentNextPage}
                                    tableHeadText=''
                                    tableData={datas.current.assignments}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='phlebotomies'
                                    marginTop='mt-4'

                                    dataCount={dataCount.current.assignments}
                                    // currentPage={currentPage}
                                    // setCurrentPage={setCurrentPage}
                                    // changePage={handleFetchNextPage}
                                />
                            )
                            }
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Phlebotomies
