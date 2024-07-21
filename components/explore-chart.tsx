"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useMemo } from "react";

function formatMonthlyListeners(value: number): string {
  // if > 1M, show in millions
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

export function ExploreChart({ chartData }: { chartData: any[] }) {
  const [activeLines, setActiveLines] = useState<string[]>([]);

  const { uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    const ids = Array.from(new Set(chartData.map((item) => item.id)));
    const allValues = chartData.flatMap((item) =>
      Object.values(item).filter((val) => typeof val === "number")
    );
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return {
      uniqueIds: ids,
      yAxisMin: Math.floor(min),
      yAxisMax: Math.ceil(max),
    };
  }, [chartData]);

  const chartConfig = useMemo(() => {
    return uniqueIds.reduce((config, id, index) => {
      config[id] = {
        label: `ID ${id}`,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return config;
    }, {} as ChartConfig);
  }, [uniqueIds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Line Chart</CardTitle>
        <CardDescription>Monthly Listeners by ID</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="updated_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[yAxisMin, yAxisMax]}
              tickFormatter={(value) => formatMonthlyListeners(Number(value))}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {uniqueIds.map((id, index) => (
              <Line
                key={id}
                type="linear"
                dataKey={(entry) =>
                  entry.id === id ? entry.monthly_listeners : null
                }
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={false}
                name={`ID ${id}`}
                hide={activeLines.length > 0 && !activeLines.includes(id)}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
