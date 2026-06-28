"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SnapshotPoint {
  date: string;
  skillsCompleted: number;
  roadmapProgress: number;
  projectsCompleted: number;
}

export function GrowthTrendChart({ data }: { data: SnapshotPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#475569" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="skillsCompleted" name="Skills proficient" stroke="#06B6D4" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="roadmapProgress" name="Roadmap progress %" stroke="#0F172A" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="projectsCompleted" name="Projects completed" stroke="#16A34A" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
