"use client";

import { useMemo } from "react";
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
import {
  formatChartDate,
  formatDateRange,
  formatMonthlyListeners,
} from "@/lib/utils";
import Image from "next/image";

export function ExploreChart({
  dateRange,
}: {
  dateRange: {
    min: string;
    max: string;
  };
}) {
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

    return {
      chartData,
      uniqueIds: uniqueIds,
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

  const yAxisStep = (yAxisMax - yAxisMin) / 4;
  const xAxisStep = Math.ceil(chartData.length / 7);

  // Generate an array of 5 evenly spaced tick values
  const yAxisTicks = Array.from(
    { length: 5 },
    (_, index) => yAxisMin + yAxisStep * index
  );

  const xAxisTicks = Array.from(
    { length: 7 }, // Changed from 8 to 7
    (_, index) => {
      const reverseIndex = 6 - index; // 6, 5, 4, ..., 0
      return chartData[
        Math.max(chartData.length - 1 - xAxisStep * reverseIndex, 0)
      ]?.date;
    }
  ).concat(chartData[chartData.length - 1]?.date);

  return (
    <Card className="w-11/12 sm:mt-5 mt-10 mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Image
            src="/spotify-color.svg"
            alt="logo"
            className="w-5 h-5"
            width={10}
            height={10}
          />
          Monthly Listeners
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {formatDateRange(dateRange.min, dateRange.max)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={25}
              padding={{ left: 10, right: 25 }}
              angle={-30}
              ticks={xAxisTicks}
              tickFormatter={formatChartDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[yAxisMin, yAxisMax]}
              tickFormatter={(value) => formatMonthlyListeners(Number(value))}
              tickMargin={5}
              ticks={yAxisTicks}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={formatChartDate}
                />
              }
            />
            {uniqueIds.map((id) => (
              <Line
                key={id}
                type="linear"
                dataKey={id}
                stroke={`hsl(var(--chart-${
                  (selectedArtists.find((artist) => artist.id === id)
                    ?.selectIndex || 0) + 1
                }))`}
                strokeWidth={2}
                dot={false}
                animationDuration={800}
                name={`${
                  selectedArtists.find((artist) => artist.id === id)?.name
                }`}
              />
            ))}
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
