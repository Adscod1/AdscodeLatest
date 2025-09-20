const StoreCardSkeleton = () => (
  <div className="flex items-center gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export const LoadingState = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-16" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <StoreCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
