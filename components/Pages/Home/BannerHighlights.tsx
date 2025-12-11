import React from "react";
import Image from "next/image";

const BannerHighlights = () => {
  return (
    <div className="w-11/12 mx-auto pt-6 pb-24">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left Image - iPhone Exchange */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md flex">
          <Image
            src="/images/highlight1.png"
            alt="iPhone Exchange"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Middle Section - Category Grid */}
        <div className="flex-1 bg-gradient-to-b from-orange-100 to-orange-300 rounded-2xl shadow-md flex flex-col p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 ">
            Shop the Best in Each Category
          </h1>

          <div className="grid grid-cols-2 gap-5 flex-grow">
            {/* Reusable Card */}
            {[
              { src: "/images/headphone.png", label: "HeadPhone" },
              { src: "/images/Neckband.png", label: "NeckBand" },
              { src: "/images/ipad.png", label: "Ipad" },
              { src: "/images/charger.png", label: "Charger" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-between p-4 hover:shadow-lg transition"
              >
                <div className="flex-1 flex items-center justify-center w-full">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={450}
                    height={450}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h1 className="font-bold text-sm md:text-xl text-gray-800 mt-3">
                  {item.label}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image - Oppo A5X */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md flex">
          <Image
            src="/images/highlight2.png"
            alt="Oppo A5X"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default BannerHighlights;