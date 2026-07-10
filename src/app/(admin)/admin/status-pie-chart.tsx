'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { normalizeArray } from '@/lib/safe-array';
import type { OrderStatusCount } from '@/lib/mock-admin-data';

export function StatusPieChart({ data }: { data: OrderStatusCount[] }) {
  const safeData = normalizeArray<OrderStatusCount>(data);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={safeData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {safeData.map((entry: OrderStatusCount, index: number) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(val, name) => [Number(val), name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
