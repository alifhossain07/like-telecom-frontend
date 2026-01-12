import React from "react";

const ExclusiveDealsSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
            <div className="flex flex-col items-center mb-10">
                <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full max-w-2xl bg-gray-100 rounded mb-2"></div>
                <div className="h-4 w-3/4 max-w-xl bg-gray-100 rounded"></div>
            </div>

            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full aspect-[21/9] md:aspect-[25/8] bg-gray-200 rounded-[20px]"></div>
                ))}
            </div>
        </div>
    );
};

export default ExclusiveDealsSkeleton;
