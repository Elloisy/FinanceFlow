'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '@/lib/categories';

const FALLBACK_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

interface Props {
  data: Array<{ name: string; value: number }>;
}

export default function ExpensePieChart({ data }: Props) {
  const safeData = data ?? [];

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={safeData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationDuration={800}
          >
            {safeData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS?.[entry?.name] ?? FALLBACK_COLORS?.[index % FALLBACK_COLORS.length] ?? '#6B7280'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`R$ ${Number(value ?? 0).toFixed(2)}`, '']}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
