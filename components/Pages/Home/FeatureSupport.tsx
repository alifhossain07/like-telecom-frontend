"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type TrustSignal = {
  icon: string;
  title: string;
};

const SkeletonItem = () => (
  <div className="bg-orange-100 w-[80px] aspect-square md:w-full md:aspect-[1.5/1] rounded-lg flex flex-col items-center justify-center animate-pulse">
    <div className="bg-orange-200 w-6 h-6 md:w-10 md:h-10 mb-1 md:mb-1.5 rounded-full" />
    <div className="bg-orange-200 h-2.5 md:h-3.5 w-[60%] md:w-[70%] rounded" />
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
    <div className="w-11/12 mx-auto pb-7 pt-7 md:pt-0">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 pb-4 text-center justify-items-stretch">
        {loading && skeletons}
        {error && (
          <div className="col-span-6 text-center text-red-500 py-4">{error}</div>
        )}
        {!loading && !error && signals.map((item, idx) => (
          <div
            key={idx}
            className="bg-orange-100 w-full aspect-square md:aspect-[1.5/1] rounded-lg flex flex-col items-center justify-center p-1"
          >
            <Image
              src={item.icon}
              alt={item.title}
              width={40}
              height={40}
              className="text-xl md:text-[clamp(20px,2vw,40px)] mb-1 md:mb-1.5 w-6 h-6 md:w-10 md:h-10 object-contain"
              loading="lazy"
              unoptimized
            />
            <span className="text-[11px] md:text-[clamp(11px,0.9vw,16px)] leading-tight">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSupport;
