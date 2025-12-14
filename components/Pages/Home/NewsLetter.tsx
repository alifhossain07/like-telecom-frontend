"use client";

import Loader from "@/components/ui/Loader";
import React, { useEffect, useState } from "react";

type HomeBottomBanner = {
  image: string;
  title: string;
};

const NewsLetter = () => {
  const [data, setData] = useState<HomeBottomBanner | null>(null);
  const [loading, setLoading] = useState(true);

  // -------- FORMAT TITLE --------
  const formatTitle = (title: string) => {
    return title
      .replace(/\*(.*?)\*/g, (_, text) => {
        return `<span class="highlight-banner-text">${text}</span>`;
      })
      .replace(/\n/g, "<br/>");
  };

  // -------- FETCH BANNER ONLY --------
  useEffect(() => {
    const fetchBottomBanner = async () => {
      try {
        console.log("📡 Fetching /api/banners ...");

        const res = await fetch("/api/banners", { cache: "no-store" });
        const json = await res.json();

        // 🔍 FULL SERVER RESPONSE
        console.log("✅ Full API response:", json);

        // 🔍 HOME BOTTOM BANNER DATA
        console.log("🖼️ homeBottomBanner:", json.homeBottomBanner);

        // 🔍 INDIVIDUAL FIELDS
        console.log("🖼️ Banner Image:", json.homeBottomBanner?.image);
        console.log("📝 Banner Title:", json.homeBottomBanner?.title);

        setData(json.homeBottomBanner);
      } catch (error) {
        console.error("❌ Failed to load newsletter banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBottomBanner();
  }, []);

  // -------- LOG WHEN STATE CHANGES --------
  useEffect(() => {
    if (data) {
      console.log("📦 Data stored in state:", data);
    }
  }, [data]);

  // -------- LOADING --------
  if (loading) {
    return (
      <div className="w-11/12 mx-auto h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
        <Loader />
      </div>
    );
  }

  if (!data) {
    console.warn("⚠️ No banner data available");
    return null;
  }

  return (
    <div className="w-11/12 mx-auto">
      <div
        className="
          relative rounded-md overflow-hidden
          bg-cover bg-center
          flex items-center justify-center
          min-h-[280px] md:min-h-[350px] xl:min-h-[420px]
          px-6
        "
        style={{ backgroundImage: `url(${data.image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTENT */}
        <div className="relative z-10 text-center text-white max-w-2xl w-full space-y-6">
          {/* Title */}
          <h2
            className="
              text-2xl md:text-3xl xl:text-4xl
              font-semibold leading-tight
            "
            dangerouslySetInnerHTML={{ __html: formatTitle(data.title) }}
          />

          {/* Newsletter Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="
                w-full sm:w-[320px]
                px-4 py-3
                rounded-md
                text-gray-800
                focus:outline-none
              "
            />

            <button
              type="submit"
              className="
                bg-orange-500 hover:bg-orange-600
                text-white font-semibold
                px-6 py-3
                rounded-md
                transition
              "
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
