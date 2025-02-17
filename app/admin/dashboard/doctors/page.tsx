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
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode'


const Doctors = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets]  = useState<number>(0);
    const limit = 10;    
    const [searchActive, setSearchActive] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dataCount = useRef<number>(0);
    const doctorsData = useRef<TableData[]>([]);
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const [staffWithId, setStafftWithId] = useState<string | null>(null) // id of staff to delete
    const { user } = useAuth()
    const Id = user?.id
    const verifiedUsers = useRef<number>(0)
    const newStaffs = useRef<number>(0)
    const unverifedStaffs = useRef<number>(0)
    

    const fetchPatients = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: testsDataLoading } = await getUsersByType('doctor', limit, offset);
            if (error) {
                console.log('Error fetching users from api:', error);
                return;
            }
            if (!doctorsData.current) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getUserByUserType?.users) {
                // Update the ref instead of state
                const doctors = data.getUserByUserType?.users as TableData[]
                const updatedDoctors = doctors?.map((singleStaff) => {

                    const {
                        id,
                        __typename,
                        approvalToken,
                        approvedAt,
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
                        referralBonus,
                        latitude,
                        longitude,
                        emailVerifiedAt,
                        accountStatus,
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
                    const name = (firstName && lastName) ? `${firstName} ${lastName}` : 'Not Set'
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
                        staff: [null, name, singleStaff.email],
                        ...rest,
                        city: patientCity,
                        state: patientState,
                        verified: active,
                        status: status,
                        is_active: accountStatus,
                        approved_at: approvedAt ? new Date(approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not approved'
                    };

                    return newPatientData
                }) || [];


                const allTests = [...updatedDoctors];
                doctorsData.current = Array.from(
                    new Map(
                        [...doctorsData.current, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                );
                dataCount.current = data.getUserByUserType.usersCount;
                setOffsets(offset + limit)
                // offsets = limit + offsets;
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            // console.log("finally")
        }
    }, []);

    const handleSearch = useCallback(async (searchTerm: string,  limit: number, offset: number) => {
            try {
                setPageLoading(true)
                const { data, error, loading: testsDataLoading } = await SearchUsersByType(searchTerm, 'doctor', limit, offset);
                
                if (error) {
                    console.log('Error fetching tests from api:', error);
                    return;
                }
                
                if (data && data.searchUsers?.users) {
                    // Update the ref instead of state
                    
                    const doctors = data.searchUsers?.users as TableData[]
                    const updatedDoctors = doctors?.map((singleDoctor) => {

                        const {
                            id,
                            __typename,
                            approvalToken,
                            approvedAt,
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
                        } = singleDoctor;

                        const name = (firstName && lastName) ? `${firstName} ${lastName}` : 'Not Set'
                        const active = emailVerifiedAt ? 'verified' : 'unverified'
                        const status = approvedAt ? 'approved' : 'pending approval'
                        const patientCity = city ? city : 'Not set'
                        const patientState = state ? state : 'Not set'
                        const activity = deletedAt ? "deleted" : "active"
                        
                        const newDoctorData = {
                            id,
                            staff: [null, name, singleDoctor.email],
                            ...rest,
                            city: patientCity,
                            state: patientState,
                            verified: active,
                            status: status,
                            is_active: activity,
                            approved_at: approvedAt ? new Date(approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not approved'
                        };

                        return newDoctorData
                    }) || [];



                    const allDoctors = [...updatedDoctors];
                    console.log(allDoctors)
                   
                    if (offset === 0) {
                        doctorsData.current=[]  
                    }
                    doctorsData.current = Array.from(
                        new Map(
                            [...doctorsData.current, ...allDoctors].map(item => [item.id, item])
                        ).values()
                    );
                    dataCount.current = data.searchUsers.usersCount;
                    setOffsets(offset + limit)
                   
                }
    
            } catch (err) {
                console.log('error fetching tests catch error', err);
            } finally {
                setPageLoading(false)
            }
    }, []);
        
    const handleSearchData = (searchTerm: string) => {
        setOffsets(0)
        setSearchActive(true)
        setSearchTerm(searchTerm)
        handleSearch(searchTerm, limit, 0);
    }
    
    const handleFetchNextPage = () => {
        if (searchActive) {
            if (doctorsData.current.length < (limit * (currentPage + 1))) {
                handleSearch(searchTerm, limit, offsets);
            } 
        } else {
            if (doctorsData.current.length < (limit * (currentPage + 1))) {
                fetchPatients(limit, offsets);
            }
            return;

        }
    }

    useEffect(() => {
        fetchPatients(limit, 0);
    }, [fetchPatients, limit]);


   
    const [approveStaff, { loading: approveStaffLoading }] = useMutation(ApproveAccount, {
        variables: {
            userForApproval: staffWithId,
            approvingAdmin: decodeJwtEncodedId(user?.id as string),

        },
        client,
    });

    const handleApproveStaff = async () => {
        setPageLoadingFromClick(true)
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
            setPageLoadingFromClick(false)

        }

    }

    const [deleteStaff, { loading: deleteTestLoading }] = useMutation(DeleteUser, {
        variables: {
            id: staffWithId,

        },
        client,
    });

    const handleDeleteStaff = async () => {
        console.log(staffWithId)
        setPageLoadingFromClick(true)
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
            setPageLoadingFromClick(false)

        }

    }



    return (
        <div>

            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Doctors" showExportRecord={true} />
                    <div className="px-8 py-4 ">
                        {pageLoading

                            ?
                            'loading.....'
                            :
                            <TotalPatients
                                loading={pageLoading}
                                totalusers={dataCount.current}
                                newUsers={newStaffs.current}
                                verifiedUsers={verifiedUsers.current}
                                unverifedPatients={unverifedStaffs.current}

                            />
                        }
                        {pageLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                handleSearchData={handleSearchData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                deleteAction={handleDeleteStaff}
                                approveAction={handleApproveStaff}
                                setItemToDelete={setStafftWithId}
                                changePage={handleFetchNextPage}
                                tableHeadText={`Doctors ${dataCount.current}`}
                                tableData={doctorsData.current}
                                dataCount={dataCount.current}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='doctors'
                                marginTop='mt-4'
                            />
                        }


                    </div>
                </div>
            </div>
            {
                pageLoadingFromClick &&
                <div className="flex items-center justify-center min-h-screen fixed w-full bg-[#ffffff54] top-0 left-0">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-green-500 border-green-200 rounded-full"></div>
                </div>
            }

        </div>
    )
}

export default Doctors
