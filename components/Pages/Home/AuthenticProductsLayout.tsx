"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AuthenticProductsLayoutSkeleton from "@/components/Skeletons/AuthenticProductsLayoutSkeleton";

type InfoRow = {
  [key: string]: string;
};

type ApiData = {
  banner_image_one: string;
  banner_image_two: string;
  info_rows: InfoRow[];
};

const AuthenticProductsLayout: React.FC = () => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract title and paragraph from info row
  const extractTitleAndParagraph = (item: InfoRow) => {
    const titleKey = Object.keys(item).find((key) => key.startsWith("title_"));
    const paragraphKey = Object.keys(item).find((key) =>
      key.startsWith("paragraph_")
    );

    return {
      title: titleKey ? item[titleKey] : "",
      paragraph: paragraphKey ? item[paragraphKey] : "",
    };
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home-info-seo", { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to load home info SEO data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <AuthenticProductsLayoutSkeleton />;
  }

  if (!data || !data.info_rows || data.info_rows.length < 5) {
    return null;
  }

  // Extract title and paragraph for each info row
  const leftText1 = extractTitleAndParagraph(data.info_rows[0]);
  const leftText2 = extractTitleAndParagraph(data.info_rows[1]);
  const leftText3 = extractTitleAndParagraph(data.info_rows[2]);
  const rightText1 = extractTitleAndParagraph(data.info_rows[3]);
  const rightText2 = extractTitleAndParagraph(data.info_rows[4]);

  return (
    <div className="w-11/12 mx-auto 2xl:py-12">
      {/* Two equal-height columns */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-between gap-5 h-full">
          {/* 1️⃣ Text */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {leftText1.title}
            </h2>
            {leftText1.paragraph}
          </div>

          {/* 2️⃣ Image */}
          {data.banner_image_one && data.banner_image_one.trim() !== '' ? (
            <div className="rounded-xl overflow-hidden shadow bg-black flex items-center justify-center h-[330px]">
              <Image
                src={data.banner_image_one}
                alt="Banner Image One"
                width={500}
                height={400}
                className="object-contain w-full h-full rounded-lg"
                unoptimized
                onError={(e) => {
                  console.error("Failed to load banner_image_one:", data.banner_image_one);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow bg-black flex items-center justify-center h-[330px]">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}

          {/* 3️⃣ Text */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {leftText2.title}
            </h2>
            {leftText2.paragraph}
          </div>

          {/* 4️⃣ Text */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {leftText3.title}
            </h2>
            {leftText3.paragraph}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-5 h-full">
          {/* 1️⃣ Text - expands to fill space until image */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow p-6 flex-grow">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {rightText1.title}
            </h2>
            {rightText1.paragraph}
          </div>

          {/* 2️⃣ Image */}
          {data.banner_image_two && data.banner_image_two.trim() !== '' ? (
            <div className="rounded-xl overflow-hidden shadow bg-gray-900 flex items-center justify-center h-[330px] flex-shrink-0">
              <Image
                src={data.banner_image_two}
                alt="Banner Image Two"
                width={500}
                height={400}
                className="object-contain w-full h-full rounded-lg"
                unoptimized
                onError={(e) => {
                  console.error("Failed to load banner_image_two:", data.banner_image_two);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow bg-gray-900 flex items-center justify-center h-[330px] flex-shrink-0">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}

          {/* 3️⃣ Text - expands to fill remaining space */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow p-6 flex-grow">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {rightText2.title}
            </h2>
            {rightText2.paragraph}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticProductsLayout;