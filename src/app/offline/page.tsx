'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-2">Koneksi Terputus</h1>
      <p className="text-sm text-[#8E8E93] text-center mb-6">
        Kamu sedang offline. Periksa koneksi internetmu dan coba lagi.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#F5A623] text-white px-6 py-2 rounded-lg font-medium text-sm"
      >
        Coba Lagi
      </button>
    </div>
  );
}
