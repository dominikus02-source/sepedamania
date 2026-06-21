export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-[#E2E8F0] rounded-lg" />
      <div className="h-4 w-72 bg-[#E2E8F0] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#E2E8F0] rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-[#E2E8F0] rounded-xl mt-4" />
    </div>
  );
}
