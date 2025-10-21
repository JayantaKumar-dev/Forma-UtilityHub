// src/components/LoadingSkeleton.jsx
export default function LoadingSkeleton() {
  return (
    <div className="p-6 sm:p-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-2xl shadow-inner"
            />
          ))}
      </div>
    </div>
  );
}
