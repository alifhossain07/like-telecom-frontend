"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import DealDetailsSkeleton from "@/components/Skeletons/DealDetailsSkeleton";

interface Product {
    id: number;
    slug: string;
    name: string;
    thumbnail_image: string;
    main_price: string;
    stroked_price: string;
    discount: string;
    rating: number;
}

interface DealDetail {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    banner_subtitle_top: string;
    banner_title: string;
    banner_subtitle_bottom: string;
    products: {
        data: Product[];
    };
}

const DealDetailsPage = ({ params }: { params: { slug: string } }) => {
    const [deal, setDeal] = useState<DealDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDealDetails = async () => {
            try {
                const response = await axios.get(`/api/exclusive-deals/${params.slug}`);
                if (response.data.success && response.data.data.length > 0) {
                    setDeal(response.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching deal details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealDetails();
    }, [params.slug]);

    if (loading) {
        return <DealDetailsSkeleton />;
    }

    if (!deal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
                <h1 className="text-2xl font-bold">Deal not found</h1>
                <p>The deal you are looking for might have expired or does not exist.</p>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen pb-20">
            {/* Top Header Banner ("Exclusive Sale") */}
            <div className="w-full bg-[#EB6420] py-10 md:py-20 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]">
                        Exclusive Sale
                    </h1>
                </div>
            </div>

            <div className="w-full md:w-11/12 mx-auto px-4 mt-8 md:mt-12">
                {/* Selected Deal Banner */}
                <div
                    className="relative w-full aspect-[21/9] md:aspect-[25/8] rounded-[20px] overflow-hidden flex flex-col items-center justify-center text-center p-4 shadow-xl mb-12"
                    style={{
                        backgroundImage: `url(${deal.banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="relative z-10 flex flex-col items-center gap-1 md:gap-3 text-white drop-shadow-md">
                        <h3 className="text-lg md:text-2xl xl:text-4xl font-semibold opacity-90 uppercase tracking-wider">
                            {deal.banner_subtitle_top}
                        </h3>
                        <h1 className="text-2xl md:text-5xl xl:text-7xl font-black leading-tight max-w-4xl">
                            {deal.banner_title}
                        </h1>
                        <p className="text-sm md:text-xl xl:text-2xl font-medium opacity-80 uppercase">
                            {deal.banner_subtitle_bottom}
                        </p>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {deal.products.data.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                slug: product.slug,
                                image: product.thumbnail_image,
                                name: product.name,
                                price: parseFloat(product.main_price.replace("৳", "").replace(",", "")),
                                oldPrice: parseFloat(product.stroked_price.replace("৳", "").replace(",", "")),
                                discount: product.discount,
                                rating: product.rating,
                                reviews: 0,
                            }}
                        />
                    ))}
                </div>

                {deal.products.data.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No products found for this deal.
                    </div>
                )}
            </div>
        </main>
    );
};

export default DealDetailsPage;
