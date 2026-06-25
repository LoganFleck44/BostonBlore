"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function ProgressChart({ entries }: { entries: Array<{ date: string; weight: number | null }> }) {
  const data = entries
    .filter((e) => e.weight !== null)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
      weight: e.weight,
    }));

  if (data.length < 2) return <p className="text-sm text-ash">Log more entries to see your trend.</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#25252b" />
        <XAxis dataKey="date" tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{ background: "#1a1a1e", border: "1px solid #25252b", borderRadius: 8 }}
          labelStyle={{ color: "#f4f4f5", fontSize: 12 }}
          itemStyle={{ color: "#ff7a1a" }}
        />
        <Line type="monotone" dataKey="weight" stroke="#ff4d1c" strokeWidth={2} dot={{ fill: "#ff4d1c", r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
