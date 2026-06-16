"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface LeadTrendChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function LeadTrendChart({ data }: LeadTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm italic">
        Not enough data gathered in the last 30 days.
      </div>
    );
  }

  // Format date strings for nicer X-Axis display (e.g. "May 25")
  const formattedData = data.map(item => {
      const d = new Date(item.date);
      return {
          ...item,
          displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formattedData}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis
            dataKey="displayDate"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            allowDecimals={false}
        />
        <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
            itemStyle={{ color: '#2563eb' }}
        />
        <Area
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            name="Leads Ingested"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
