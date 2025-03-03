"use client"
import { Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple pie chart"

type ChartDataProps = { test_Name: string, requestCount: number, fill: string }

interface PieChartAnalyticsProps {
    chartData: ChartDataProps[];
    chartStyle?: string;
}

const chartConfig: ChartConfig = {
    requestCount: {
        label: "Top Tests",
    },
}

export const chartColors = [
    "green",
    "red",
    "blue",
    "orange",
    "purple",
];

export const PieChartAnalytics2: React.FC<PieChartAnalyticsProps> = ({ chartData, chartStyle }) => {
    // Assign colors dynamically if `fill` is missing
    const formattedData = chartData.map((item, index) => ({
        ...item,
        fill: chartColors[index % chartColors.length], // Cycle through colors
    }));

    return (
        <ChartContainer
            config={chartConfig}
            className={`mx-auto aspect-square `}
        >
            <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Pie data={formattedData} dataKey="requestCount" nameKey="test_Name" outerRadius={chartStyle} />
            </PieChart>
        </ChartContainer>
    );
};
