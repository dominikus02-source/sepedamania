'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { OrderStatusCount } from '@/lib/mock-admin-data';

export function StatusPieChart({ data }: { data: OrderStatusCount[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {data.map((entry: OrderStatusCount, index: number) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(val, name) => [Number(val), name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
