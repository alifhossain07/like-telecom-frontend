"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type TrustSignal = {
  icon: string;
  title: string;
};

const SkeletonItem = () => (
  <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4] rounded-lg flex flex-col items-center justify-center animate-pulse">
    <div className="bg-orange-200 w-8 h-8 md:w-12 md:h-12 mb-1 md:mb-2 rounded-full" />
    <div className="bg-orange-200 h-3 md:h-4 w-[60%] md:w-[70%] rounded" />
  </div>
);

const FeatureSupport = () => {
  const [signals, setSignals] = useState<TrustSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch("/api/trust-signals", { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setSignals(json.data || []);
        } else {
          setError("Failed to load features");
        }
      } catch {
        setError("Failed to load features");
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, []);

  const skeletons = Array.from({ length: 6 }, (_, i) => <SkeletonItem key={i} />);

  return (
    <div className="w-11/12 mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 pb-7 text-center justify-items-center md:justify-items-stretch">
        {loading && skeletons}
        {error && (
          <div className="col-span-6 text-center text-red-500 py-6">{error}</div>
        )}
        {!loading && !error && signals.map((item, idx) => (
          <div
            key={idx}
            className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4] rounded-lg flex flex-col items-center justify-center"
          >
            <Image
              src={item.icon}
              alt={item.title}
              width={48}
              height={48}
              className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2 w-8 h-8 md:w-12 md:h-12 object-contain"
              loading="lazy"
              unoptimized
            />
            <span className="text-[12px] md:text-[clamp(12px,1vw,18px)] leading-tight">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSupport;
