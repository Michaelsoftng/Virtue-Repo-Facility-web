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

const chartData = [
    { browser: "completed", visitors: 35, fill: "#6CB9E3" },
    { browser: "cancelled", visitors: 20, fill: "#FFC152" },
]

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

interface DoughnutPieAnalyticsProps {
    className?: string;
}

export const DoughnutPieAnalytics: React.FC<DoughnutPieAnalyticsProps> = ({ className = "" }) => {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className={`flex flex-col ${className}`}>
            <CardHeader className="items-left pb-0">
                <CardTitle>55 request made</CardTitle>
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
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
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
                                                    Requests made
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
                <div className="flex justify-between gap-3 font-medium leading-none">
                    <div className="flex gap-1">
                        <span className="h-4 w-4 rounded-full bg-[#6CB9E3] inline-block"></span>
                        <p className="text-[13px] text-[#8C93A3]"><strong className="text-black">35</strong> Request completed</p>
                    </div>
                    <div className="flex gap-1">
                        <span className="h-4 w-4 rounded-full bg-[#FFC152] inline-block"></span>
                        <p className="text-[13px] text-[#8C93A3]"><strong className="text-black">35</strong> Request cancelled</p>
                    </div>
                </div>
                
            </CardFooter>
        </Card>
    )
}
