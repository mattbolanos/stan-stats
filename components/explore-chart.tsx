"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
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
import { useMediaQuery } from "@/hooks/use-media-query";

export function ExploreChart({
  dateRange,
  className,
}: {
  dateRange: {
    min: string;
    max: string;
  };
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { artistStreams, selectedArtists } = useExplore();

  const { chartData, uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    const dataMap = new Map();
    const visibleArtists = selectedArtists
      .filter((artist) => artist.show)
      .map((artist) => artist.id);
    let min = Infinity;
    let max = -Infinity;

    artistStreams.forEach((stream) => {
      if (visibleArtists.includes(stream.id)) {
        if (!dataMap.has(stream.updated_at)) {
          dataMap.set(stream.updated_at, {});
        }
        dataMap.get(stream.updated_at)[stream.id] = stream.monthly_listeners;
        min = Math.min(min, stream.monthly_listeners);
        max = Math.max(max, stream.monthly_listeners);
      }
    });

    const chartData = Array.from(dataMap.entries()).map(([date, values]) => ({
      date,
      ...values,
    }));

    return {
      chartData,
      uniqueIds: visibleArtists,
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

  const yAxisStep = Math.round(((yAxisMax - yAxisMin) / 4) * 1000) / 1000;
  const xAxisStep = Math.ceil(chartData.length / 7);

  // Generate an array of 5 evenly spaced tick values
  const yAxisTicks = Array.from(
    { length: 5 },
    (_, index) => yAxisMin + yAxisStep * index
  );

  const formattedTicks = yAxisTicks.map((tick) => formatMonthlyListeners(tick));
  const areTicksUnique = new Set(formattedTicks).size === formattedTicks.length;

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
    <Card className={`max-w-5xl lg:max-w-3xl h-fit w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xs sm:text-base">
          <Image
            src="/spotify-color.svg"
            alt="logo"
            width={24}
            height={24}
            className="shrink-0 w-6 h-6"
          />
          Monthly Listeners
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-base">
          {formatDateRange(dateRange.min, dateRange.max)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
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
                tickFormatter={(value) =>
                  formatMonthlyListeners(Number(value), areTicksUnique ? 1 : 2)
                }
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
                  animateNewValues={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
