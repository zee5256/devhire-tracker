"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FunnelPoint, OutcomePoint, WeeklyPoint } from "@/lib/analytics";

const tooltipStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
};

const axisTick = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
};

export function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          minTickGap={12}
        />
        <YAxis
          allowDecimals={false}
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--muted-foreground)" }} />
        <Line
          type="monotone"
          dataKey="applications"
          name="Applications"
          stroke="#5b5bd6"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#5b5bd6", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="interviews"
          name="Interviews & offers"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart({ data }: { data: FunnelPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          horizontal={false}
        />
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={76}
          tick={axisTick}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Bar dataKey="count" name="Applications" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OutcomesDonut({
  data,
  total,
}: {
  data: OutcomePoint[];
  total: number;
}) {
  const visible = data.filter((entry) => entry.value > 0);

  if (visible.length === 0) {
    return (
      <div className="grid h-[220px] place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
        No applications yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {visible.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-2xl font-semibold tabular-nums">{total}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              applied
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {data.map((entry) => (
          <li
            key={entry.name}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.fill }}
              aria-hidden
            />
            <span className="truncate">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums text-foreground">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
