"use client";

import React, { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import NewsLetterBannerSkeleton from "@/components/Skeletons/NewsLetterBannerSkeleton";

type HomeBottomBanner = {
  image: string;
  title: string;
};

const NewsletterBanner: React.FC = () => {
  const [data, setData] = useState<HomeBottomBanner | null>(null);
  const [loading, setLoading] = useState(true);

  // -------- FORMAT TITLE --------
  const formatTitle = (title: string) => {
    return title
      .replace(/\*(.*?)\*/g, (_, text) => {
        return `<span class="underline underline-offset-4">${text}</span>`;
      })
      .replace(/\n/g, "<br/>");
  };

  // -------- FETCH BANNER DATA --------
  useEffect(() => {
    const fetchBottomBanner = async () => {
      try {
        console.log("📡 Fetching /api/banners ...");

        const res = await fetch("/api/banners", { cache: "no-store" });
        const json = await res.json();

        console.log("🖼️ Background Image:", json.homeBottomBanner?.image);
        console.log("📝 Title:", json.homeBottomBanner?.title);

        setData(json.homeBottomBanner);
      } catch (error) {
        console.error("❌ Failed to load newsletter banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBottomBanner();
  }, []);

  // -------- LOADING --------
  if (loading) {
    return <NewsLetterBannerSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="w-11/12 pb-10 mx-auto mt-12">
      <div
        className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: `url(${data.image})`,
          backgroundSize: "contain",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay (keeps text readable) */}
       

        {/* Left Side */}
        <div className="relative z-10 flex flex-col items-start gap-5 max-w-lg text-center md:text-left">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug"
            dangerouslySetInnerHTML={{ __html: formatTitle(data.title) }}
          />

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-transparent border border-white/60 rounded-full px-4 py-2 w-full sm:w-auto">
              <FiMail className="text-white/80 mr-2 text-lg" />
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent outline-none placeholder-white/70 text-white text-sm w-full sm:w-64"
              />
            </div>

            <button className="bg-white text-orange-600 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition w-full sm:w-auto">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
