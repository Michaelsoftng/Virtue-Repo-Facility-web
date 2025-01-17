/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/src/thirdParty/chart"


const chartData = [
    { item: "Jan", usuage: 186 },
    { item: "Feb", usuage: 305 },
    { item: "Mar", usuage: 237 },
    { item: "Apr", usuage: 73 },
    { item: "May", usuage: 209 },
    { item: "Jun", usuage: 214 },
    { item: "Jul", usuage: 104 },
    { item: "Aug", usuage: 14 },
    { item: "Sep", usuage: 84 },
    { item: "Oct", usuage: 104 },
    { item: "Nov", usuage: 14 },
    { item: "Dec", usuage: 354 },
];

const chartConfig = {
    usuage: {
        label: "usuage",
        color: "lighterBlue",
    },
    // mobile: {
    //     label: "Mobile",
    //     color: "darkerblue",
    // },
} satisfies ChartConfig

// interface StylesProp {
//     classNames: string
// }



const BarChartYaxis = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isAutoAllocate, setIsAutoAllocate] = useState(false);

    const handleToggle = () => {
        setIsAutoAllocate((prevState) => !prevState);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseEnter = (data: any, index: any) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };
    const updatedChartData = chartData.map((entry, index) => ({
        ...entry,
        fill: index === activeIndex || index === chartData.length - 1 ? "#08AC85" : "#08AC851A"  // Change color for index 1
    }));
    return (
        <>
       
        <div className="mb-11">
                <div >
                    <h3 className="font-bold text-black text-[16px] pt-4 "> Inventory allocation</h3>
                    <p className='text-[#8C93A3] text-[14px] mt-2 mb-4'>Allocate inventory to phlebotomist</p>
                </div>
                <div className="flex justify-items-start gap-[150px]">
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isAutoAllocate}
                                onChange={handleToggle}
                                style={{ display: 'none' }}
                            />
                            <span
                                style={{
                                    width: '80px',
                                    height: '40px',
                                    background: isAutoAllocate ? '#08AC85' : '#ccc',
                                    borderRadius: '20px',
                                    position: 'relative',
                                    transition: 'background 0.3s',
                                }}
                            >
                                <span
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '2px',
                                        left: isAutoAllocate ? '42px' : '2px',
                                        transition: 'left 0.3s',
                                    }}
                                />
                            </span>
                        </label>
                        <span className="font-[600] text-[16px] text-[#8C93A3] ml-2" >
                            Auto allocate every item
                        </span>
                    </div>
                    <div>
                        <button className="py-[8px] px-[14px] font-[600] text-[16px] text-[#08AC85] border-2 border-[#08AC85] rounded-sm">Manual allocation</button>
                    </div>
                </div>
        </div>
        <div className="grid grid-cols-[80%_20%] rounded p-4 bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1)">
            <div>
                <div className='grid grid-cols-[220px_190px] gap-[calc(100%-410px)] mb-6 pt-4'>
                    <div>
                        <h3 className="font-bold text-black text-[16px] ">Inventory Usage</h3>
                        <p className='text-[#8C93A3] text-[14px]'>Total item  usage per item</p>
                    </div>

                    <div className={`h-[30px] flex gap-2`}>
                        <select name="gender" id="" className="w-full h-full font-semibold text-xs text-gray-400 px-3 py-1 bg-transparent border-solid block border-2 rounded border-gray-300">
                            <option value="">2024</option>
                            <option value="male">2023</option>
                            <option value="female">2022</option>
                        </select>
                        <select
                            name="items"
                            id="items"
                            className="w-full h-full font-semibold text-xs text-gray-400 px-3 py-1 bg-transparent border-solid block border-2 rounded border-gray-300"
                        >
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>

                    </div>
                </div>

                <div>
                    <ChartContainer config={chartConfig} className='h-[300px] w-full bg-white'>
                        <BarChart accessibilityLayer data={chartData} barCategoryGap="20%">
                            <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="#8884d8" strokeOpacity={0.3} />
                            <YAxis
                                tickLine={false} // Removes tick lines for a cleaner look
                                axisLine={false} // Removes the axis line for a cleaner design
                                tickMargin={10} // Adds margin between the ticks and labels
                                width={40} // Adjusts the width of the Y-axis
                                tickFormatter={(value) => `${value}`} // Formats the tick labels
                            />
                            <XAxis
                                dataKey="item"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                                wrapperStyle={{ backgroundColor: '#08AC85', borderRadius: '5px', padding: '10px' }}  // Tooltip style
                                labelStyle={{ color: 'white', fontWeight: 'bold' }}  // Label style
                                itemStyle={{ color: '#08AC85' }}  // Item (data) style
                                allowEscapeViewBox={{ x: false, y: true }}  // Allow the tooltip to escape on y-axis
                                // position={{ x: 50, y: 50 }}  // Fixed position (optional)
                                formatter={(value) => `${value} usuage`}  // Custom value formatting
                                isAnimationActive={true}
                            />
                            {/* <Bar
                                dataKey="usuage"
                                // fill={"#08AC85"}
                                fill={( index ) => {
                                        const colors = ["#08AC85", "#FF6347", "#FFD700", "#1E90FF", "#9370DB"];
                                        return colors[index % colors.length];
                                    }}
                                // fill={activeIndex !== null ? "#08AC85" : "#08AC851A"} // Static default fill for compatibility
                                radius={[5, 5, 0, 0]} // Border radius
                            // onMouseEnter={handleMouseEnter}
                            // onMouseLeave={handleMouseLeave}
                            /> */}
                                <Bar dataKey="usuage" radius={[5, 5, 0, 0]}>
                                    {chartData.map((entry, index) => {
                                        const colors = ["#08AC85", "#FF6347", "#FFD700", "#1E90FF", "#9370DB"];
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={colors[index % colors.length]} // Assign color from array
                                            />
                                        );
                                    })}
                                </Bar>
                        </BarChart>

                    </ChartContainer>

                </div>
            </div> 
            <div className='h-full bg-white flex justify-center items-center'>
                <ul>
                    <li className="flex gap-2 "><span className="mt-[2px] rounded h-5 w-5 bg-red-500 inline-block">&nbsp;</span><span>Sample bottle</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-green-500 inline-block"></span><span>Needle</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-yellow-500 inline-block"></span><span>Gloves</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-blue-500 inline-block"></span><span>Cotton wool</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-gray-500 inline-block"></span><span>Methylated spirit</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-purple-500 inline-block"></span><span>Pressure cuff</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-pink-500 inline-block"></span><span>Bolt strips</span></li>
                    <li className="flex gap-2 mt-2"><span className="mt-[2px] rounded h-5 w-5 bg-red-200 inline-block"></span><span>Swabs</span></li>
                </ul>
            </div>     
        </div>
            
            
        </>

    )
}

export default BarChartYaxis
