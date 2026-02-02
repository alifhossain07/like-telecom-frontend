"use client";

import React from "react";

const CorporatePageSkeleton = () => {
    return (
        <div className="bg-white min-h-screen font-sans 2xl:text-lg animate-pulse">
            {/* Hero Section Skeleton */}
            <section className="bg-[#f9f9f9] py-16 px-4 md:px-8">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 2xl:gap-24">
                    {/* Left Content Skeleton */}
                    <div className="lg:w-1/2 bg-gray-100 p-6 2xl:p-12 rounded-lg">
                        <div className="h-10 md:h-14 2xl:h-20 bg-gray-200 rounded mb-6 2xl:mb-12 w-3/4"></div>
                        <div className="h-4 2xl:h-6 bg-gray-200 rounded mb-10 2xl:mb-16 w-full max-w-lg 2xl:max-w-2xl"></div>

                        {/* Info Cards Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-10">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white p-6 2xl:p-10 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 2xl:w-20 2xl:h-20 bg-gray-100 rounded-full mb-4 2xl:mb-8"></div>
                                    <div className="h-6 bg-gray-100 rounded mb-2 w-24"></div>
                                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Form Skeleton */}
                    <div className="lg:w-1/2 bg-white p-8 2xl:p-16 rounded-2xl shadow-lg border border-gray-100">
                        <div className="h-8 2xl:h-12 bg-gray-100 rounded mb-6 2xl:mb-10 w-48"></div>
                        <div className="h-4 2xl:h-6 bg-gray-100 rounded mb-8 2xl:mb-12 w-64"></div>

                        <div className="space-y-6 2xl:space-y-10">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i}>
                                    <div className="h-4 bg-gray-100 rounded mb-2 w-20"></div>
                                    <div className="h-12 2xl:h-16 bg-gray-50 rounded border border-gray-100"></div>
                                </div>
                            ))}
                            <div className="flex justify-end">
                                <div className="h-12 2xl:h-16 w-32 2xl:w-48 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Clients Section Skeleton */}
            <section className="py-20 2xl:py-40 bg-white">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 text-center">
                    <div className="h-10 2xl:h-16 bg-gray-100 rounded mx-auto mb-4 2xl:mb-8 w-64"></div>
                    <div className="h-4 2xl:h-6 bg-gray-100 rounded mx-auto mb-12 2xl:mb-24 w-96"></div>

                    <div className="flex gap-8 2xl:gap-16 justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-shrink-0 border p-2 2xl:p-6 rounded w-48 h-16 2xl:w-80 2xl:h-32 bg-gray-50 border-gray-100"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Empowering Business Section Skeleton */}
            <section className="bg-gray-100 py-10 2xl:py-24">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 text-center">
                    <div className="h-8 2xl:h-14 bg-gray-200 rounded mx-auto mb-2 2xl:mb-8 w-72"></div>
                    <div className="h-4 2xl:h-8 bg-gray-200 rounded mx-auto mb-16 2xl:mb-32 w-full max-w-2xl 2xl:max-w-5xl"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 2xl:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-8 2xl:p-16 rounded-lg shadow-sm border border-gray-200">
                                <div className="h-10 2xl:h-16 bg-gray-100 rounded mx-auto mb-4 w-16"></div>
                                <div className="h-4 2xl:h-6 bg-gray-100 rounded mx-auto w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experts Section Skeleton */}
            <section className="py-20 2xl:py-40 bg-white">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4">
                    <div className="text-center mb-16 2xl:mb-32">
                        <div className="h-8 2xl:h-14 bg-gray-100 rounded mx-auto mb-2 2xl:mb-8 w-64"></div>
                        <div className="h-4 2xl:h-8 bg-gray-100 rounded mx-auto w-full max-w-3xl 2xl:max-w-6xl"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                                <div className="aspect-[4/5] bg-gray-100 rounded mb-4"></div>
                                <div className="h-6 bg-gray-100 rounded mx-auto mb-2 w-32"></div>
                                <div className="h-4 bg-gray-100 rounded mx-auto w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section Skeleton */}
            <section className="py-20 2xl:py-40 bg-white">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4">
                    <div className="text-center mb-16 2xl:mb-32 px-4">
                        <div className="h-10 2xl:h-16 bg-gray-100 rounded mx-auto mb-4 2xl:mb-8 w-80"></div>
                        <div className="h-4 2xl:h-8 bg-gray-100 rounded mx-auto w-full max-w-3xl 2xl:max-w-6xl"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 2xl:gap-32">
                        <div className="lg:w-5/12 relative h-[450px] md:h-[550px] 2xl:h-[750px]">
                            <div className="absolute top-0 right-0 w-[85%] h-[70%] bg-gray-100 rounded-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-[65%] h-[60%] bg-gray-200 border-4 border-white rounded-2xl shadow-xl"></div>
                        </div>
                        <div className="lg:w-7/12 space-y-10 2xl:space-y-20">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-6 md:gap-8 2xl:gap-14 items-start">
                                    <div className="w-12 h-12 md:w-14 md:h-14 2xl:w-20 2xl:h-20 bg-gray-100 rounded-lg"></div>
                                    <div className="pt-2 flex-grow">
                                        <div className="h-6 2xl:h-10 bg-gray-100 rounded mb-3 2xl:mb-6 w-1/2"></div>
                                        <div className="h-4 2xl:h-6 bg-gray-100 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Skeleton */}
            <section className="py-20 2xl:py-40 bg-[#f4f4f4]">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto  bg-white py-12 2xl:py-24 px-8 2xl:px-16 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-8 2xl:h-14 bg-gray-100 rounded mx-auto mb-12 2xl:mb-24 w-48"></div>
                    <div className="space-y-3 2xl:space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 2xl:h-24 bg-gray-50 border border-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CorporatePageSkeleton;
