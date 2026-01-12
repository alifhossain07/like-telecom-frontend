import React from "react";

const DealDetailsSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Top Header Banner Skeleton */}
            <div className="w-full h-40 md:h-64 bg-gray-200"></div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Deal Banner Skeleton */}
                <div className="w-full aspect-[21/9] md:aspect-[25/8] bg-gray-200 rounded-[20px] mb-12"></div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>
                            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealDetailsSkeleton;
