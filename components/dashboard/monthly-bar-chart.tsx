'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {
  data: Array<{ month: string; rendas: number; gastos: number }>;
}

export default function MonthlyBarChart({ data }: Props) {
  const safeData = data ?? [];

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: 10 }}
            tickFormatter={(v: any) => `${(Number(v ?? 0) / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: any) => [`R$ ${Number(value ?? 0).toFixed(2)}`, '']}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: 11 }}
          />
          <Bar dataKey="rendas" name="Rendas" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={800} />
          <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
