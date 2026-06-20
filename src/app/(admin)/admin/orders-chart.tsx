'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenuePoint } from '@/lib/mock-admin-data';

export function OrdersChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8E8E93' }} axisLine={{ stroke: '#E5E5EA' }} />
        <YAxis tick={{ fontSize: 12, fill: '#8E8E93' }} axisLine={{ stroke: '#E5E5EA' }} />
        <Tooltip formatter={(val) => [Number(val), 'Pesanan']} labelFormatter={(label) => `Tanggal: ${label}`} />
        <Bar dataKey="orders" fill="#007AFF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
