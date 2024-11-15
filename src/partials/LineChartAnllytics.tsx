"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type ChartDataProps = { month: string, requests: number, payments: number }
interface LineChartAnalyticsProps {
    chartData: ChartDataProps[];
}



const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#775DA6",
    },
    mobile: {
        label: "Mobile",
        color: "#ABDFE7",
    },
} satisfies ChartConfig

export const LineChartAnalytics: React.FC<LineChartAnalyticsProps> = ({ chartData }) => {
    return (
       
        <ChartContainer config={chartConfig} className='h-[250px] w-full bg-lighterBlue'>
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid
                    vertical={false}
                    stroke="#8884d8"             // Set the color of the grid lines
                    strokeDasharray="5 5"        // Dash pattern: 5px line, 5px space
                    strokeOpacity={0.6}          // Opacity of the grid lines
                    strokeWidth={1}              // Thickness of the grid lines
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, 'dataMax']} // Adjust based on your data range
                    ticks={[0, 100, 200, 300, 400]}
                />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    interval={0}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                    dataKey="requests"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="payments"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
            
    )
}
