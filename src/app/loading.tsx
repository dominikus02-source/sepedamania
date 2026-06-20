export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F7]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#8E8E93]">Memuat...</p>
      </div>
    </div>
  );
}
