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
  const isDesktop = useMediaQuery("(min-width: 640px)");

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
  const xAxisStep = Math.ceil(chartData.length / (isDesktop ? 7 : 5));

  // Generate an array of 5 evenly spaced tick values
  const yAxisTicks = Array.from(
    { length: 5 },
    (_, index) => yAxisMin + yAxisStep * index
  );

  const formattedTicks = yAxisTicks.map((tick) => formatMonthlyListeners(tick));
  const areTicksUnique = new Set(formattedTicks).size === formattedTicks.length;

  const xAxisTicks = Array.from({ length: isDesktop ? 7 : 5 }, (_, index) => {
    const reverseIndex = isDesktop ? 6 - index : 4 - index;
    return chartData[
      Math.max(chartData.length - 1 - xAxisStep * reverseIndex, 0)
    ]?.date;
  }).concat(chartData[chartData.length - 1]?.date);

  return (
    <Card className={`max-w-4xl w-full border border-muted ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xs sm:text-base">
          <Image
            src="/spotify-color.svg"
            alt="logo"
            width={24}
            height={24}
            className="shrink-0 sm:w-6 sm:h-6 w-4 h-4"
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
              margin={{
                left: isDesktop ? 0 : -10,
                right: isDesktop ? 12 : 12,
                top: isDesktop ? 20 : 12,
                bottom: isDesktop ? 20 : 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={isDesktop ? 25 : 15}
                padding={{
                  left: isDesktop ? 10 : 0,
                  right: isDesktop ? 25 : 10,
                }}
                angle={-30}
                ticks={xAxisTicks}
                tickFormatter={formatChartDate}
                tick={{ fontSize: isDesktop ? "11px" : "8px" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[yAxisMin, yAxisMax]}
                tickFormatter={(value) =>
                  formatMonthlyListeners(Number(value), areTicksUnique ? 1 : 2)
                }
                tickMargin={isDesktop ? 5 : 0}
                ticks={yAxisTicks}
                tick={{ fontSize: isDesktop ? "11px" : "8px" }}
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
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="text-[11px] sm:text-base mt-1 sm:mt-8"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
