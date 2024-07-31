"use client";

import { useState, useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { useExplore } from "@/contexts/ExploreContext";

function formatMonthlyListeners(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

export function ExploreChart() {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const { artistStreams } = useExplore();

  const { chartData, uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    const dataMap = new Map();
    let min = Infinity;
    let max = -Infinity;

    artistStreams.forEach((stream) => {
      if (!dataMap.has(stream.updated_at)) {
        dataMap.set(stream.updated_at, {});
      }
      dataMap.get(stream.updated_at)[stream.id] = stream.monthly_listeners;
      min = Math.min(min, stream.monthly_listeners);
      max = Math.max(max, stream.monthly_listeners);
    });

    const chartData = Array.from(dataMap.entries()).map(([date, values]) => ({
      date,
      ...values,
    }));

    const uniqueIds = Array.from(new Set(artistStreams.map((item) => item.id)));
    setActiveLines(uniqueIds.map(String));

    return {
      chartData,
      uniqueIds,
      yAxisMin: Math.floor(min),
      yAxisMax: Math.ceil(max),
    };
  }, [artistStreams]);

  const chartConfig = useMemo(() => {
    return uniqueIds.reduce((config, id, index) => {
      config[id] = {
        label: `ID ${id}`,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return config;
    }, {} as ChartConfig);
  }, [uniqueIds]);

  const handleLegendClick = (entry: any) => {
    const entryId = entry.dataKey;
    if (activeLines.includes(entryId)) {
      setActiveLines(activeLines.filter((id) => id !== entryId));
    } else {
      setActiveLines([...activeLines, entryId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Line Chart</CardTitle>
        <CardDescription>Monthly Listeners by ID</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
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
            <ChartTooltip content={<ChartTooltipContent />} />
            {uniqueIds.map((id, index) => (
              <Line
                key={id}
                type="linear"
                dataKey={id}
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={false}
                name={`ID ${id}`}
                hide={!activeLines.includes(String(id))}
              />
            ))}
            <Legend onClick={handleLegendClick} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
