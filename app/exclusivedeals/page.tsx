"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DealBanner from "@/components/Pages/ExclusiveDeals/DealBanner";
import ExclusiveDealsSkeleton from "@/components/Skeletons/ExclusiveDealsSkeleton";

interface Deal {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    banner_subtitle_top: string;
    banner_title: string;
    banner_subtitle_bottom: string;
}

const ExclusiveDealsPage = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await axios.get("/api/exclusive-deals");
                if (response.data.success) {
                    setDeals(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching exclusive deals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading) {
        return <ExclusiveDealsSkeleton />;
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="w-full md:w-11/12 mx-auto px-4 py-8 md:py-16">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-3xl 2xl:text-4xl font-bold text-[#1D1D1F] mb-4">
                        Exclusive Offers
                    </h1>
                    <p className="text-sm md:text-lg 2xl:text-lg text-[#424245]  font-base leading-relaxed">
                        Discover a curated collection of exclusive offers designed to bring you exceptional value. Enjoy special pricing on premium products that are carefully selected for quality and reliability. These limited-time deals are available only for a short period, so don’t miss the chance to save more on the products you love.
                    </p>
                </div>

                {/* Deals List */}
                <div className="flex flex-col gap-6 md:gap-10">
                    {deals.map((deal) => (
                        <DealBanner
                            key={deal.id}
                            slug={deal.slug}
                            banner={deal.banner}
                            title={deal.title}
                            subtitleTop={deal.banner_subtitle_top}
                            bannerTitle={deal.banner_title}
                            subtitleBottom={deal.banner_subtitle_bottom}
                        />
                    ))}
                    {deals.length === 0 && !loading && (
                        <div className="text-center py-20 text-gray-500">
                            No exclusive deals available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ExclusiveDealsPage;
