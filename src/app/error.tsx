'use client';

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2F2F7] p-4">
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-8 max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h1 className="text-xl font-bold text-[#1C1C1E]">Terjadi Kesalahan</h1>
        <p className="text-sm text-[#8E8E93]">{error.message || 'Silakan coba lagi'}</p>
        <button onClick={reset} className="bg-[#F5A623] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#E09515] transition-colors">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
