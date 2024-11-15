"use client"
import React, { useState } from 'react'
// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/src/thirdParty/chart"


const chartData = [
    { month: "Jan", requests: 186},
    { month: "Feb", requests: 305},
    { month: "Mar", requests: 237},
    { month: "Apr", requests: 73},
    { month: "May", requests: 209},
    { month: "Jun", requests: 214},
    { month: "Jul", requests: 104},
    { month: "Aug", requests: 14},
    { month: "Sep", requests: 84},
    { month: "Oct", requests: 104},
    { month: "Nov", requests: 14},
    { month: "Dec", requests: 354},
];

const chartConfig = {
    requests: {
        label: "requests",
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



const BarChartAnalytics = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleMouseEnter = (data, index) => {
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
        <div className="rounded p-4 bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1)">
            <div className='grid grid-cols-[250px_80px] gap-[calc(100%-330px)] mb-4'>
                <div className="">
                    <h3 className="font-bold text-black text-[18px] pl-4 pt-4"> Recieved requests</h3>
                </div>

                <div className={`h-[30px] `}>
                    <select name="gender" id="" className="w-full h-full font-semibold text-xs text-gray-400 px-3 py-1 bg-transparent border-solid block border-2 rounded border-gray-300">
                        <option value="" >2024</option>
                        <option value="male">2023</option>
                        <option value="female">2022</option>

                    </select>
                    
                </div>
            </div>  
           
            <div>
                <ChartContainer config={chartConfig} className='h-[250px] w-full bg-lighterBlue'>
                    <BarChart accessibilityLayer data={updatedChartData} barCategoryGap="30%">
                        {/* <CartesianGrid vertical={false}  /> */}
                        <XAxis
                            dataKey="month"
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
                            formatter={(value) => `${value} requests`}  // Custom value formatting
                            isAnimationActive={true} 
                        />
                        <Bar
                            dataKey="requests"
                            fill={data => data.fill}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            radius={[40, 40, 0, 0]}  // Border radius
                            
                         
                        />                        
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
                
           
    )
}

export default BarChartAnalytics
