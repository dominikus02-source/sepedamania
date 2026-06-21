'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/customer/star-rating';
import { Pencil, ChevronLeft, Star } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function getMockReviews(): Review[] {
  return mockProducts.slice(0, 5).map((p, i) => ({
    id: `r${i}`,
    productId: p.id,
    productName: p.name,
    productImage: p.images[0] || '',
    rating: 4 + (i % 2),
    comment: 'Produk sesuai deskripsi, kualitas bagus. Pengiriman cepat dan packing aman. Recommended!',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(getMockReviews());

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/profil" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0F172A]">Ulasan Saya</h1>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
          <p className="text-sm text-[#64748B]">Belum ada ulasan</p>
          <Link href="/"><Button variant="outline" className="mt-3">Belanja Sekarang</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <Link href={`/produk/${review.productId}`} className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                  <Image src={review.productImage || '/images/placeholder.svg'} alt={review.productName} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{review.productName}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(review.createdAt)}</p>
                </div>
              </Link>
              <StarRating rating={review.rating} size="sm" />
              <p className="text-sm text-[#0F172A] mt-2 leading-relaxed">{review.comment}</p>
              <button className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#2563EB] mt-2 font-medium transition-colors">
                <Pencil className="w-3 h-3" /> Edit Ulasan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
