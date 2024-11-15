import React from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BarChartAnalytics from '@/src/partials/BarChartAnalytics'
import AvailableTestIcon from '@/src/reuseable/icons/AvailableTestIcons'
import { TableData } from '@/src/types/TableData.type';
import RequestTable from '@/src/partials/tables/RequestTable'
import { PieChartAnalytics } from '@/src/partials/tables/PieChartAnalytics'
import Link from 'next/link'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import PDFImage from '@/public/assets/images/utilities/pdf.png'
import Image from 'next/image'

const sampleData: TableData[] = [
	{
		patients: [null, 'John Doe', 'egeregav@gmail.com'],
		test: 'Covid 19',
		amount: 30000,
		phlebotomist: ['female.jpg', 'John Doe', 'egeregav@gmail.com'],
		sample_status: 'pending'
	},
	{
		patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
		test: 'Malaria',
		amount: 20000,
		phlebotomist: ['male.jpg', 'David Clark', 'davidclark@example.com'],
		sample_status: 'received'
	},
	{
		patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
		test: 'Typhoid',
		amount: 15000,
		phlebotomist: ['female.jpg', 'Emily White', 'emilywhite@example.com'],
		sample_status: 'completed'
	},
	{
		patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
		test: 'Blood Test',
		amount: 25000,
		phlebotomist: ['male.jpg', 'Michael Scott', 'michaelscott@example.com'],
		sample_status: '444-333-2222'
	},
	{
		patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
		test: 'HIV Test',
		amount: 10000,
		phlebotomist: ['female.jpg', 'Sophia Turner', 'sophiaturner@example.com'],
		sample_status: '111-222-3333'
	},
	// {
	// 	patients: ['male.jpg', 'Linda Thomas', 'lindathomas@example.com'],
	// 	test: 'Cholesterol',
	// 	amount: 18000,
	// 	phlebotomist: ['male.jpg', 'James Parker', 'jamesparker@example.com'],
	// 	sample_status: '222-444-6666'
	// },
	// {
	// 	patients: ['female.jpg', 'Steve Martin', 'stevemartin@example.com'],
	// 	test: 'Blood Sugar',
	// 	amount: 22000,
	// 	phlebotomist: ['female.jpg', 'Isabella Lewis', 'isabellalewis@example.com'],
	// 	sample_status: '777-888-9999'
	// },
	// {
	// 	patients: ['male.jpg', 'Emily Davis', 'emilydavis@example.com'],
	// 	test: 'Urine Test',
	// 	amount: 12000,
	// 	phlebotomist: ['male.jpg', 'Ryan Phillips', 'ryanphillips@example.com'],
	// 	sample_status: '333-555-7777'
	// },
	// {
	// 	patients: ['female.jpg', 'Daniel Taylor', 'danieltaylor@example.com'],
	// 	test: 'DNA Test',
	// 	amount: 50000,
	// 	phlebotomist: ['female.jpg', 'Emma Wilson', 'emmawilson@example.com'],
	// 	sample_status: '888-999-0000'
	// },
	// {
	// 	patients: ['male.jpg', 'Sarah King', 'sarahking@example.com'],
	// 	test: 'Pregnancy Test',
	// 	amount: 8000,
	// 	phlebotomist: ['male.jpg', 'Jacob Walker', 'jacobwalker@example.com'],
	// 	sample_status: '666-777-8888'
	// }
];
const chartData = [
	{ test: "Covid", visitors: 275, fill: "red" },
	{ test: "Malaria", visitors: 200, fill: "green" },
	{ test: "RVS", visitors: 187, fill: "purple" },
	{ test: "Hyperloric A.", visitors: 173, fill: "blue" },
	{ test: "others", visitors: 90, fill: "#44AC21" },
]
const colorCombination = [
	'bg-red-500 text-white',
	'bg-blue-800 text-yellow-500',
	'bg-yellow-500 text-black',
	'bg-green-500 text-white',
]
const Home = () => {
  	return (
		<div>
			<FacilityHeader />
			<div className="grid grid-cols-[250px_calc(100%-250px)]">
				<FacilityMenu />
					<div className="bg-[#F5F6F7] grid grid-cols-[65%_calc(35%-20px)] gap-[20px] px-[20px] pt-6">
					<div>
						<BarChartAnalytics />
						<RequestTable tableData={sampleData} />
					</div>
					<div>
						<div className="px-6 py-3  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<AvailableTestIcon />
							<h3>Available tests</h3>
							<p className="text-[40px] font-bold">24</p>
						</div>
						<div className="mt-2 px-6 py-2  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<h2 className="text-[20px] font-bold text-black">Top Test</h2>
							<div className="grid grid-cols-[65%_35%] gap-2">

								<div>
									<PieChartAnalytics chartData={chartData} />
								</div>
								

								<div>

									{chartData.map((entry, index) => (
										<div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
											<span className="rounded-full p-[1.5]"
												style={{
													backgroundColor: entry.fill,
													display: 'inline-block',
													width: '12px',
													height: '12px',
													marginRight: '8px'
												}}
											></span>
											<span className="text-[#555555] text-[10px] poppins leading-5">{entry.test}</span>
										</div>
									))}

								</div>
							</div>
						</div>
						<div className="mt-6 px-6 py-6  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
							<div className="flex justify-between py-4 px-2">
								<h2 className="font-bold text-black text-2xl">Recent Uploads</h2>
								<Link href='#' className="text-[#08AC85] font-bold">view all</Link>
							</div>
							<div className="mt-6">
								<div className="flex justify-between">
									<div className="flex justify-between gap-2">
										<RoundedNoImage
											text='AD'
											classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
										/>
									
											<div className="text-[#231935] text-[14px]">James Hadish
												<br /> <span className="text-[#727A8B] text-[12px]">jameshadish@gmail.com</span>
										</div>
									</div>
										<div className="text-[#08AC85] font-medium text-[14px]">
										2 files
									</div>
								</div>
									<div className="grid grid-cols-4  mt-6">
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
									</div>
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
									</div>
										
								</div>
								
							</div>
								<div className="border-t-2  mt-6 pt-6">
								<div className="flex justify-between">
									<div className="flex justify-between gap-2">
										<RoundedNoImage
											text='AD'
											classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
										/>
									
											<div className="text-[#231935] text-[14px]">James Hadish
												<br /> <span className="text-[#727A8B] text-[12px]">jameshadish@gmail.com</span>
										</div>
									</div>
										<div className="text-[#08AC85] font-medium text-[14px]">
										4 files
									</div>
								</div>
								<div className="grid grid-cols-4 justify-between mt-6">
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
									</div>
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
										</div>
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
									</div>
									<div>
										<Image src={PDFImage} alt='' />
										<p>12345.pdf</p>
									</div>
										
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
