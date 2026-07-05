"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// HEVY-style weekly training chart: volume (or workout count) per week.
export function WeeklyVolumeChart({
  weeks,
}: {
  weeks: Array<{ label: string; volume: number; workouts: number }>;
}) {
  if (weeks.every((w) => w.volume === 0)) {
    return <p className="text-sm text-ash">Log a few workouts to see your weekly volume here.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={weeks}>
        <CartesianGrid strokeDasharray="3 3" stroke="#25252b" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} width={45}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
        <Tooltip
          cursor={{ fill: "rgba(255, 122, 26, 0.06)" }}
          contentStyle={{ background: "#1a1a1e", border: "1px solid #25252b", borderRadius: 8 }}
          labelStyle={{ color: "#f4f4f5", fontSize: 12 }}
          itemStyle={{ color: "#ff7a1a" }}
          formatter={(value, key) => [
            key === "volume" ? `${Math.round(Number(value)).toLocaleString()} lbs` : value,
            key === "volume" ? "Volume" : "Workouts",
          ]}
        />
        <Bar dataKey="volume" fill="#ff4d1c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
