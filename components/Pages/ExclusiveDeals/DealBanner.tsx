"use client";

import React from "react";
import Link from "next/link";

interface DealBannerProps {
    slug: string;
    banner: string;
    title: string;
    subtitleTop?: string;
    bannerTitle?: string;
    subtitleBottom?: string;
}

const DealBanner: React.FC<DealBannerProps> = ({
    slug,
    banner,
    subtitleTop,
    bannerTitle,
    subtitleBottom,
}) => {
    return (
        <Link href={`/exclusivedeals/${slug}`} className="block w-full">
            <div
                className="relative w-full aspect-[21/9] md:aspect-[25/8] rounded-[20px] overflow-hidden flex flex-col items-center justify-center text-center p-4 transition-transform duration-300 hover:scale-[1.01] shadow-lg mb-6"
                style={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay content if banner doesn't have text baked in */}
                {/* Based on the mockup, we might need to overlay this text */}
                <div className="relative z-10 flex flex-col items-center gap-1 md:gap-3 text-white drop-shadow-md">
                    {subtitleTop && (
                        <h3 className="text-lg md:text-2xl xl:text-4xl font-semibold opacity-90">
                            {subtitleTop}
                        </h3>
                    )}
                    {bannerTitle && (
                        <h1 className="text-2xl md:text-4xl xl:text-6xl font-black leading-tight max-w-2xl">
                            {bannerTitle}
                        </h1>
                    )}
                    {subtitleBottom && (
                        <p className="text-sm md:text-xl xl:text-2xl font-medium opacity-80">
                            {subtitleBottom}
                        </p>
                    )}
                </div>

                {/* Subtle dark overlay for better text readability if needed */}
                {/* <div className="absolute inset-0 bg-black/5 z-0"></div> */}
            </div>
        </Link>
    );
};

export default DealBanner;
