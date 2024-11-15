"use client"
import { Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple pie chart"

type ChartDataProps = { test: string, visitors: number, fill: string }
interface PieChartAnalyticsProps {
    chartData: ChartDataProps[];
    chartStyle?:string
}
const chartConfig = {
    visitors: {
        label: "Top Tests",
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


export const PieChartAnalytics: React.FC<PieChartAnalyticsProps> = ({ chartData, chartStyle }) =>{
    return (
 
                <ChartContainer
                    config={chartConfig}
                    className={`mx-auto aspect-square ${chartStyle ?? 'max-h-[140px]'}`}

                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={chartData} dataKey="visitors" nameKey="browser" />
                    </PieChart>
                </ChartContainer>
                


    )
}
