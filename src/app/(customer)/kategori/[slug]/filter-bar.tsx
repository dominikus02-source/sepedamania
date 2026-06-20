'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function FilterBar() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="p-4">
            <h3 className="font-semibold text-[#1C1C1E] mb-4">Filter</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#1C1C1E] mb-2">Rentang Harga</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full h-9 rounded-lg border border-[#E5E5EA] px-3 text-sm" />
                  <input type="number" placeholder="Max" className="w-full h-9 rounded-lg border border-[#E5E5EA] px-3 text-sm" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C1C1E] mb-2">Urutkan</p>
                <select className="w-full h-9 rounded-lg border border-[#E5E5EA] px-3 text-sm">
                  <option>Terpopuler</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                  <option>Terbaru</option>
                </select>
              </div>
              <Button className="w-full">Terapkan Filter</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {['Semua', 'Terbaru', 'Terpopuler', 'Harga Turun'].map((sort) => (
        <button
          key={sort}
          className="px-3 py-1.5 rounded-full border border-[#E5E5EA] text-xs font-medium text-[#1C1C1E] whitespace-nowrap hover:border-[#F5A623] transition-colors"
        >
          {sort}
        </button>
      ))}
    </div>
  );
}
