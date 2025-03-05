"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/src/thirdParty/chart"

export const description = "A donut chart with text"

// const chartData = [
//     { browser: "completed", visitors: 35, fill: "#6CB9E3" },
//     { browser: "cancelled", visitors: 20, fill: "#FFC152" },
// ]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const statusColors = {
    completed: "#08AC85",
    ongoing: "#08AC85",
    pending: "#FFC152",
    cancelled: "#FFC152",
    scheduled: "#6CB9E3",
    unpaid: "#E74C3C"
};

interface DoughnutPieAnalyticsProps {
    className?: string;
    chartData: {
        completed: number,
        ongoing: number,
        pending: number,
        cancelled: number,
        scheduled: number,
        unpaid: number
    }
}

export const DoughnutPieAnalytics: React.FC<DoughnutPieAnalyticsProps> = ({ className = "", chartData }) => {
    const formattedData = Object.entries(chartData).map(([status, count]) => ({
        status,
        count: Number(count) || 0, // Convert count to a number,
        fill: (statusColors as Record<string, string>)[status] || "#CCCCCC" // Type assertion
    }));


    const totalVisitors = React.useMemo(() => {
        let total = 0;
        // console.log(typeof total )
        formattedData.forEach((value) => {
            total += value.count
        });
        return total;
    }, [formattedData]);




    return (
        <Card className={`flex flex-col ${className}`}>
            <CardHeader className="items-left pb-0">
                <CardTitle>{totalVisitors} request Assigned</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={formattedData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Requests Assigned
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="">
                <div className="grid grid-cols-2 gap-y-2 gap-3 font-medium leading-none">
                    {
                        formattedData.map((data, index) => {
                            switch (data.status) {
                                case "__typename":
                                case "unpaid":
                                    return
                                    break;
                            
                                default:
                                    return(
                                    <div key={index} className="flex gap-1">
                                        <span className={`h-4 w-4 rounded-full bg-[${data.fill}] inline-block`}></span>
                                        <p className="text-[13px] text-[#8C93A3]"><strong className="text-black">{data.count}</strong> Request {data.status}</p>
                                    </div>
                                    )
                                    break;
                            }
                            
                        })
                    }
{/*                     
                    <div className="flex gap-1">
                        <span className="h-4 w-4 rounded-full bg-[#FFC152] inline-block"></span>
                        <p className="text-[13px] text-[#8C93A3]"><strong className="text-black">35</strong> Request cancelled</p>
                    </div> */}
                </div>
                
            </CardFooter>
        </Card>
    )
}
