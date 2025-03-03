/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import BarChartAnalytics from '@/src/partials/BarChartAnalytics'
import { LineChartAnalytics } from '@/src/partials/LineChartAnllytics'
import { PieChartAnalytics } from '@/src/partials/tables/PieChartAnalytics'
import RequestTable from '@/src/partials/tables/RequestTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import BriefcaseIcon from '@/src/reuseable/icons/BriefcaseIcon'
import FiledRequestIcon from '@/src/reuseable/icons/FiledRequestIcon'
import HospitalIcon from '@/src/reuseable/icons/HospitalIcon'
import Profile2UserIconn from '@/src/reuseable/icons/Profile2UserIconn'
import { TableData } from '@/src/types/TableData.type'
import { useAuth } from '@/src/context/AuthContext'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import React, { useRef, useState } from 'react'
import Loading from '../loading'
import { useQuery } from '@apollo/client'
import { GetMonthlyRequest, GetTodaysRequest, GetTopRequestTest, GetUsersCount } from '@/src/graphql/queries'

import client from '@/lib/apolloClient';
import { useGetAllRequest } from '@/src/hooks/useGetAllRequest'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import PieChartPreloader from '@/src/preLoaders/PiechartPreloader'
import { chartColors, PieChartAnalytics2 } from '@/src/partials/tables/PieChartAnalytics2'

export interface chartEntry {
	test_Name:string,
	requestCount: number,
	__typename: string
}



function formatMoney(amount: number) {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
	}).format(amount);
}

const linechartData = [
	{ month: "January", requests: 16, payments: 80 },
	{ month: "February", requests: 35, payments: 20 },
	{ month: "March", requests: 237, payments: 120 },
	{ month: "April", requests: 73, payments: 190 },
	{ month: "May", requests: 209, payments: 130 },
	{ month: "June", requests: 214, payments: 140 },
	{ month: "July", requests: 186, payments: 80 },
	{ month: "August", requests: 305, payments: 200 },
	{ month: "September", requests: 237, payments: 120 },
	{ month: "October", requests: 173, payments: 190 },
	{ month: "November", requests: 209, payments: 230 },
	{ month: "December", requests: 124, payments: 140 },
]

const Page: React.FC = () => {
	const [year, setYear] = useState(new Date().getFullYear());
	const { data, loading: countLoading } = useQuery(GetUsersCount, {client,});
	const { data: todaysRequest, loading: todaysRequestCountLoading } = useQuery(GetTodaysRequest, { client, });
	const { data: topTestRequest, loading: topTestRequestLoading } = useQuery(GetTopRequestTest, { client, });
	const { data: monthlyRequest, loading: monthlyRequestLoading } = useQuery(GetMonthlyRequest, { client, variables:{year} });
	
	
	const userCount = data?.getUsersCount; // Use data only when available

	// RECENT REQUEST
	const { data: recentRequestData, error, loading:requestDataLoading } = useGetAllRequest(3, 0)
	const requestCount = recentRequestData?.getAllRequests.requestsCount
	const requestData = recentRequestData?.getAllRequests.requests as TableData[]
	const cachedRequestData = useRef<TableData[]>([])

	const updatedRequestData = requestData?.map((request) => {
		const {
			__typename,
			requestDate,
			patient,
			phlebotomist,
			tests,
			payment,
			testRequest,
			facility,
			package: packageData,
			samplePickUpAddress,
			requestStatus,
			sampleStatus,
			isPaid,
			balance,
			total,
			sampleCollectionDate,
			samepleDropOffDate, 
			createdAt,
			id,
			...rest
		} = request;
		const patientname = (patient.user.firstName) ? `${patient.user.firstName} ${patient.user.lastName}` : 'Not Set'
		const phlebotomistname = (phlebotomist && phlebotomist.user.firstName) ? `${phlebotomist.user.firstName} ${phlebotomist.user.lastName}` : 'Not Set'
		const newRequestData = {
			patients: [null, patientname, patient.user.email],
			test: tests.length,
			amount: total,
			phlebotomist: phlebotomist ? [null, phlebotomistname, phlebotomist.user.email] : [null, phlebotomistname, "info@labtraca.com"],
			
		};
		
		return newRequestData
	}) || []; 
	
	cachedRequestData.current = [...updatedRequestData];
	const { loading: authLoading } = useAuth();
	if (authLoading) {
		return <Loading />; // Show loading screen if loading is true
	}
	return (
			<div>
				<AdminHeader />
				<div className="grid grid-cols-[250px_calc(100%-250px)]">
					<AdminMenu />
					<div className="bg-gray-100">
						<BreadCrump pageTitle="Tests" showExportRecord={false }  />
						<div className="px-8 py-4">
							<div>
								<div className="grid grid-cols-5 gap-x-2">
									<div className="bg-white rounded-lg shadow-md px-7 py-4">
										<div className="bg-[#D3E5FE80] px-2 py-2 w-[3rem]"><Profile2UserIconn /></div>
									<p className="mt-4">Total users</p>
									{countLoading
										
										?
										<NumberPreloader />
										:
										<p className="font-bold text-3xl">{userCount.users - 1}</p>
									}
										
									</div>
									<div className="bg-white rounded-lg shadow-md px-7 py-4">
										<div className="bg-[#D3E5FE80] px-2 py-2 w-[3rem]"><BriefcaseIcon /></div>
										<p className="mt-4">Total phlebotomist</p>
										{countLoading

											?
											<NumberPreloader />
											:
										<p className="font-bold text-3xl">{userCount.phlebotomists}</p>
										}
									</div>
									<div className="bg-white rounded-lg shadow-md px-7 py-4">
										<div className="bg-[#D3E5FE80] px-2 py-2 w-[3rem]"><BriefcaseIcon /></div>
										<p className="mt-4">Total Doctors</p>
										{countLoading

											?
											<NumberPreloader />
											:
										<p className="font-bold text-3xl">{userCount.doctors}</p>
										}
									</div>
									<div className="bg-white rounded-lg shadow-md px-7 py-4">
										<div className="bg-[#D3E5FE80] px-2 py-2 w-[3rem]"><HospitalIcon /></div>
										<p className="mt-4">Total facilities</p>
										{countLoading

											?
											<NumberPreloader />
											:
										<p className="font-bold text-3xl">{userCount.facilities}</p>
										}
									</div>
									<div className="bg-white rounded-lg shadow-md px-7 py-4">
										<div className="bg-[#D3E5FE80] px-2 py-2 w-[3rem]"><FiledRequestIcon /></div>
									<p className="mt-4">Today’s request</p>
									
									{todaysRequestCountLoading

										?
										<NumberPreloader />
										:
										<p className="font-bold text-3xl">{todaysRequest.getTodaysRequest}</p>
									}
									
									</div>
								</div>
								<div className="grid grid-cols-[70%_30%] gap-x-4 mt-6">
									<div className='bg-white rounded-lg shadow-md px-2 py-4'>
										<div className="flex justify-between px-10 py-6">
											<p>
												<strong> {formatMoney(892000)}</strong>
												<span> in payments and remittance</span>
											</p>
											<div className="flex justify-between space-x-6">
												<p className="flex justify-between space-x-2">
													<span className="inline-block w-5 h-5 bg-[#775DA6] rounded-full"></span>
													<span>Payments</span>
												</p>
												<p className="flex justify-between space-x-2">
													<span className="inline-block w-5 h-5 bg-[#ABDFE7] rounded-full"></span>
													<span>Remittance</span>
												</p>
											</div>
										</div>
										<div className="mt-6" >
											<LineChartAnalytics chartData={linechartData} />
										</div>
										
									</div>
									<div className="bg-white rounded-lg shadow-md px-6 py-5 ">
										<h2 className="text-[20px] font-bold text-black">Top Test</h2>
										{topTestRequestLoading ? <PieChartPreloader /> : (
											<div>
												<PieChartAnalytics2 chartData={topTestRequest.getTopRequestedTests} chartStyle='100' />

												{/* Legend Section */}
												<div className="grid grid-cols-2 px-4">
													{topTestRequest.getTopRequestedTests.map((entry: chartEntry, index: number) => (
														<div key={index} className="grid grid-cols-[12px_calc(100%-12px)] gap-2 items-center mb-2">
															<span
																className="rounded-full p-[1.5]"
																style={{
																	backgroundColor: chartColors[index % chartColors.length],
																	display: 'inline-block',
																	width: '12px',
																	height: '12px',
																	marginRight: '8px'
																}}
															></span>
															<span className="text-[#555555] text-[10px] poppins leading-5">
																{entry.test_Name}
															</span>
														</div>
													))}
												</div>
											</div>
											)}

										
									</div>
								</div>
							<div className="grid grid-cols-2 gap-x-4 ">
								{requestDataLoading ? <TablePreloader/> : <RequestTable tableData={cachedRequestData.current} />}
								<	div className="mt-6">
									{monthlyRequestLoading ? <TablePreloader /> : <BarChartAnalytics setYear={setYear} chartData={monthlyRequest.getMonthlyRequestCount} />}
										
									</div>
									
									
								</div>
							</div>
							
						
							
						</div>
					</div>
				</div>
        	</div>
		
  	)
}


export default Page;
