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

function formatMonthlyListeners(value: number): string {
  // if > 1M, show in millions
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

const chartData = [
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-06",
    monthly_listeners: 98253313,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-07",
    monthly_listeners: 97872504,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-08",
    monthly_listeners: 97747535,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-09",
    monthly_listeners: 97645137,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-10",
    monthly_listeners: 97545519,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-11",
    monthly_listeners: 97403133,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-12",
    monthly_listeners: 97266707,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-13",
    monthly_listeners: 97345792,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-14",
    monthly_listeners: 97345792,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-15",
    monthly_listeners: 97253261,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-16",
    monthly_listeners: 97259057,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-17",
    monthly_listeners: 97335815,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-18",
    monthly_listeners: 97335815,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-19",
    monthly_listeners: 97347211,
  },
  {
    id: "06HL4z0CvFAxyc27GXpf02",
    updated_at: "2024-07-20",
    monthly_listeners: 97351489,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-06",
    monthly_listeners: 105899712,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-07",
    monthly_listeners: 105549578,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-08",
    monthly_listeners: 105434896,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-09",
    monthly_listeners: 105364685,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-10",
    monthly_listeners: 105297594,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-11",
    monthly_listeners: 105239769,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-12",
    monthly_listeners: 105243025,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-13",
    monthly_listeners: 105220661,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-14",
    monthly_listeners: 105220661,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-15",
    monthly_listeners: 105164957,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-16",
    monthly_listeners: 105174314,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-17",
    monthly_listeners: 105135896,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-18",
    monthly_listeners: 105135896,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-19",
    monthly_listeners: 105049169,
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    updated_at: "2024-07-20",
    monthly_listeners: 105041520,
  },
];

export function ExploreChart() {
  const [activeLines, setActiveLines] = useState<string[]>([]);

  const { uniqueIds, yAxisMin, yAxisMax } = useMemo(() => {
    const ids = Array.from(new Set(chartData.map((item) => item.id)));
    const allValues = chartData.flatMap((item) =>
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
  }, []);

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
