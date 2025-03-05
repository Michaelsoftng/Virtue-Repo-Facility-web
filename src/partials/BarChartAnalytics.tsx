/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/src/thirdParty/chart"




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

interface BarChartAnalyticsProps {
    chartData: { month: string, count: number }[]
    chartStyle?: string
    setYear:(year:number)=>void
}



const BarChartAnalytics: React.FC<BarChartAnalyticsProps> = ({ chartData, chartStyle, setYear })  => {
    const [activeIndex, setActiveIndex] = useState(null);
   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseEnter = (data: any, index: any) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1);
        return {
            month: date.toLocaleString("en-US", { month: "short" }),
            count: 0, // Default count is 0
            fill: "#08AC851A" // Default fill color
        };
    });

    // Map existing data
    const updatedChartData = months.map((monthEntry, index) => {
        const foundEntry = chartData.find((entry) =>
            new Date(entry.month).getMonth() === index
        );

        return {
            ...monthEntry,
            count: foundEntry ? foundEntry.count : 0, // Use existing count or 0
            fill: index === activeIndex || index === 11 ? "#08AC85" : "#08AC851A" // Highlight last month & activeIndex
        };
    });
    console.log(updatedChartData)
    return (
        <div className="rounded p-4 bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1)">
            <div className='grid grid-cols-[250px_80px] gap-[calc(100%-330px)] mb-4'>
                <div className="">
                    <h3 className="font-bold text-black text-[18px] pl-4 pt-4"> Recieved requests</h3>
                </div>

                <div className="h-[30px]">
                    <select
                        onChange={(e) => setYear(parseInt(e.target.value))} // Use onChange instead of onSelect
                        name="year"
                        className="w-full h-full font-semibold text-xs text-gray-400 px-3 py-1 bg-transparent border-solid block border-2 rounded border-gray-300"
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
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
                            dataKey="count"
                            fill={activeIndex !== null ? "#08AC85" : "#08AC851A"} // Static default fill for compatibility
                            radius={[40, 40, 0, 0]} // Border radius
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />                      
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
                
           
    )
}

export default BarChartAnalytics
