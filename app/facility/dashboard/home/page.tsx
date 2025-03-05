/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BarChartAnalytics from '@/src/partials/BarChartAnalytics'
import AvailableTestIcon from '@/src/reuseable/icons/AvailableTestIcons'
import { TableData } from '@/src/types/TableData.type';
import RequestTable from '@/src/partials/tables/RequestTable'
import Link from 'next/link'
import { useGetRecentTests } from '@/src/hooks/useGetRecentTests'
import { getFacilityTests } from '@/src/hooks/useGetAvailableTestByFacility'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import { useAuth } from '@/src/context/AuthContext'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useQuery } from '@apollo/client'
import { GetFacilityMonthlyRequestCount, GetFacilityRecentResults, GetFacilityTopRequestedTests } from '@/src/graphql/queries'
import client from '@/lib/apolloClient';
import { chartEntry } from '@/app/admin/dashboard/home/page'
import { chartColors, PieChartAnalytics2 } from '@/src/partials/tables/PieChartAnalytics2'
import PieChartPreloader from '@/src/preLoaders/PiechartPreloader'
import ResultComponent from '@/src/reuseable/components/ResultComponent'
import { ensureAbsoluteUrl } from '@/app/admin/dashboard/results/page'


const Home = () => {
	const [year, setYear] = useState(new Date().getFullYear());
	const { user } = useAuth()
	console.log({facilityAdmin:user?.facilityAdmin})
	const testCount = useRef<number>(0);
	const [isAvailableTestCountLoading, setAvailableTestCountLoading] = useState(false)
	const { data: recentTestsData, loading: recentTestsLoading } = useGetRecentTests(user?.facilityAdmin?.id as string, 5, 0);
	const recentTestData = recentTestsData?.getAllRequestsByFacility.testRequests as TableData[] 
	const { data: topTestRequest, loading: topTestRequestLoading } = useQuery(GetFacilityTopRequestedTests, { client, variables: { facilityId: user?.facilityAdmin?.id as string} });
	const { data: monthlyRequest, loading: monthlyRequestLoading } = useQuery(GetFacilityMonthlyRequestCount, { client, variables: { facilityId: user?.facilityAdmin?.id as string, year} });
	const { data: facilityRecentResults, loading: facilityRecentResultsLoading } = useQuery(GetFacilityRecentResults, { client, variables: { facilityId: user?.facilityAdmin?.id as string, limit:8, offset:0 } });
	const facilityRecentResultsData = facilityRecentResults?.getFacilityRecentResults as TableData[] 
	
	
	// Check if patientData is available before mapping
	const updatedrecentTestsData = recentTestData?.map((singleTest) => {

		const {
			__typename,
			facilityDistance,
			patientName,
			patientAge,
			package: bundle,
			request,
			test,
			facility,
			...rest
		} = singleTest;

		const newPatientData = {
			patients: request.patient.user.firstName ? [null, `${request.patient.user.firstName.trim()} ${request.patient.user.lastName.trim()}`, request.patient.user.email] : [null, 'Not Set', 'email@labtraca.com'],
			patient_name: patientName,
			patient_Age: patientAge,
			phlebotomist: request.phlebotomist ? [null, `${request.phlebotomist.user.firstName.trim()} ${request.phlebotomist.user.lastName.trim()}`, request.phlebotomist.user.email] : [null, 'Not Set', 'email@labtraca.com'],
			sample_status: request.sampleStatus
		};

		return newPatientData
	}) || []; 

	const updatedfacilityRecentResults = facilityRecentResultsData?.map((singleResult) => {

		const {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			__typename,
			patient,
			id,
			testRequest,
			requisitionNumber,
			resultFields,
			generatedPdfUrl,
			deletedAt,
			createdAt,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			...rest
		} = singleResult;

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
	}) || []; // Default to an empty array if patientData is undefined


	const fetchFacilityTests = useCallback(async (facilityId: string, limit: number, offset: number) => {
		setAvailableTestCountLoading(true);
		try {
			const { data, error, loading: testDataLoading } = await getFacilityTests(facilityId, limit, offset);
			if (error) {
				console.log('Error fetching available test jobs:', error);
				return;
			}
			if (data && data.getAvailableTestByFacility?.facilityTestCount) {
				testCount.current = data.getAvailableTestByFacility.facilityTestCount;
			}
		} catch (err) {
			console.log('Error fetching available facility tests:', err);
		} finally {
			
			setAvailableTestCountLoading(false);
			console.log("finally")
		}
	}, []);

	useEffect(() => {
		if (user?.facilityAdmin) {
			fetchFacilityTests(user?.facilityAdmin?.id as string, 10, 0);
		}
	}, [fetchFacilityTests, user?.facilityAdmin]);
  	return (
		<div>
			<FacilityHeader />
			<div className="grid grid-cols-[250px_calc(100%-250px)]">
				<FacilityMenu />
					<div className="bg-[#F5F6F7] grid grid-cols-[65%_calc(35%-20px)] gap-[20px] px-[20px] pt-6">
					<div>
							{monthlyRequestLoading ? <TablePreloader /> : <BarChartAnalytics setYear={setYear} chartData={monthlyRequest.getFacilityMonthlyRequestCount} />}
							{recentTestsLoading ? <TablePreloader /> :
							<RequestTable tableData={updatedrecentTestsData} />
							}
							
					</div>
					<div>
						<div className="px-6 py-3  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<AvailableTestIcon />
							<h3>Available tests</h3>
							{
								isAvailableTestCountLoading ? <NumberPreloader /> :
								<p className="text-[40px] font-bold">{testCount.current}</p>
							}
								
						</div>
						<div className="mt-2 px-6 py-2  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<h2 className="text-[20px] font-bold text-black">Top Test</h2>
							{topTestRequestLoading ? <PieChartPreloader /> : (
								<div className="grid grid-cols-[65%_35%] gap-2">
									<div>
										<PieChartAnalytics2 chartData={topTestRequest.getFacilityTopRequestedTests} chartStyle='100' />

									</div>
									<div>

										{topTestRequest.getFacilityTopRequestedTests.map((entry: chartEntry, index: number) => (
											<div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
												<span className="rounded-full p-[1.5]"
													style={{
														backgroundColor: chartColors[index % chartColors.length],
														display: 'inline-block',
														width: '12px',
														height: '12px',
														marginRight: '8px'
													}}
												></span>
												<span className="text-[#555555] text-[10px] poppins leading-5">{entry.test_Name}</span>
											</div>
										))}

									</div>
									
							
								</div>
							)}

						</div>
						<div className="mt-6 px-6 py-6  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<div className="flex justify-between py-4 px-2">
								<h2 className="font-bold text-black text-2xl">Recent Uploads</h2>
								<Link href='/facility/dashboard/results' className="text-[#08AC85] font-bold">view all</Link>
							</div>
							<div className="mt-6">
								<div className="flex justify-between">
									{facilityRecentResultsLoading ? <TablePreloader /> : (
										<div className={`grid gap-y-6 gap-x-2 justify-between mt-6 grid-cols-2`}>
											{updatedfacilityRecentResults.map((row, index) => (
												<Link href={ensureAbsoluteUrl(row.generatedPdfUrl)} key={row.id} rel="noopener noreferrer" target="_blank"> <ResultComponent key={index} data={row} onClick={()=>{}} /> </Link>
											))
											}

										</div>)
									}	
								
								
								</div>
								
								
							</div>
						</div>
							
							
					</div>
					
				</div>
			</div>
		</div>
  	)
}

export default Home
