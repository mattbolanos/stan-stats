"use client";

import { useState, useMemo } from "react";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useExplore } from "@/contexts/ExploreContext";
import { formatMonthlyListeners } from "@/lib/utils";

export function ExploreChart() {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const { artistStreams, selectedArtists } = useExplore();

  const { chartData, uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    const dataMap = new Map();
    const uniqueIds = Array.from(new Set(artistStreams.map((item) => item.id)));
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

    const qualSelectedArtists: string[] = selectedArtists
      .filter((artist) => uniqueIds.includes(artist.id))
      .map((artist) => artist.id);

    setActiveLines(qualSelectedArtists);

    return {
      chartData,
      uniqueIds: qualSelectedArtists,
      yAxisMin: Math.floor(min),
      yAxisMax: Math.ceil(max),
    };
  }, [artistStreams, selectedArtists]);

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
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            {uniqueIds.map((id, index) => (
              <Line
                key={id}
                type="linear"
                dataKey={id}
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={false}
                name={`${
                  selectedArtists.find((artist) => artist.id === id)?.name
                }`}
                hide={!activeLines.includes(String(id))}
              />
            ))}
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
