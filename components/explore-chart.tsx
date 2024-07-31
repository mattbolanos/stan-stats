"use client";

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
import { useState, useMemo } from "react";
import { useExplore } from "@/contexts/ExploreContext";

function formatMonthlyListeners(value: number): string {
  // if > 1M, show in millions
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

  const { uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    if (artistStreams.length === 0 || !artistStreams) {
      return {
        uniqueIds: [],
        yAxisMin: 0,
        yAxisMax: 0,
      };
    }

    const ids = Array.from(new Set(artistStreams.map((item) => item.id)));
    const allValues = artistStreams.flatMap((item) =>
      Object.values(item).filter((val) => typeof val === "number")
    );
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    setActiveLines(ids.map((id) => String(id)));

    return {
      uniqueIds: ids,
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

  const parseId = (entryValue: string): string => {
    return entryValue.split(" ")[1];
  };

  const handleLegendClick = (entry: any) => {
    const entryId = parseId(entry.value);
    if (entry.inactive) {
      setActiveLines([...activeLines, entryId]);
    } else {
      setActiveLines(activeLines.filter((id) => id !== entryId));
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
            accessibilityLayer
            data={artistStreams}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
            <Legend onClick={handleLegendClick} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
