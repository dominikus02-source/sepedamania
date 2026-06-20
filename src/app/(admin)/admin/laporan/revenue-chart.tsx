'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/lib/utils';
import type { RevenuePoint } from '@/lib/mock-admin-data';

const formatTick = (val: number) => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)}jt`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}rb`;
  return val.toString();
};

export function AdminRevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8E8E93' }} axisLine={{ stroke: '#E5E5EA' }} />
        <YAxis tick={{ fontSize: 12, fill: '#8E8E93' }} tickFormatter={formatTick} axisLine={{ stroke: '#E5E5EA' }} />
        <Tooltip formatter={(val) => [formatPrice(Number(val)), 'Pendapatan']} labelFormatter={(label) => `Tanggal: ${label}`} />
        <Area type="monotone" dataKey="revenue" stroke="#F5A623" fill="url(#revGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
