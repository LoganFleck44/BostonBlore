"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// HEVY-style exercise progression graph: heaviest weight / est 1RM / session
// volume over time for one exercise.
export function ExerciseChart({
  points,
  dataKey,
  unit,
}: {
  points: Array<{ date: string; maxWeight: number; est1RM: number; volume: number }>;
  dataKey: "maxWeight" | "est1RM" | "volume";
  unit: string;
}) {
  const data = points.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
  }));

  if (data.length < 2) {
    return <p className="text-sm text-ash">Log this exercise a couple more times to see your trend.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#25252b" />
        <XAxis dataKey="date" tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8b8b93", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} width={45} />
        <Tooltip
          contentStyle={{ background: "#1a1a1e", border: "1px solid #25252b", borderRadius: 8 }}
          labelStyle={{ color: "#f4f4f5", fontSize: 12 }}
          itemStyle={{ color: "#ff7a1a" }}
          formatter={(value) => [`${Math.round(Number(value))} ${unit}`, ""]}
        />
        <Line type="monotone" dataKey={dataKey} stroke="#ff4d1c" strokeWidth={2} dot={{ fill: "#ff4d1c", r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
