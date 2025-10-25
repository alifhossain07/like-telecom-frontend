"use client";

import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import Image from "next/image";

const FlashSale = () => {
  return (
    <div className="w-10/12 mx-auto pt-10 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center py-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Flash Sale</h1>
          <p className="text-lg text-gray-600">
            Explore brand-new products crafted for style, quality, and innovation.
          </p>
        </div>
        <button className="bg-orange-500 flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-orange-600 transition">
          See More <FiChevronRight className="text-xl" />
        </button>
      </div>

      {/* Flash Sale Grid */}
      <div className="flex items-stretch justify-between gap-6">
        {/* Deal of the Day (Full Height Orange Card) */}
        <div className="flex flex-col justify-center items-center bg-orange-500 text-white rounded-2xl p-8 text-center w-96 min-h-full">
          <div className="space-y-5 ">
            <p className="text-sm font-medium opacity-90 ">
              Only One Week Offer’s
            </p>
            <h1 className="text-2xl font-bold ">Deal Of The Day</h1>
            <p className="text-lg  ">
              Explore brand-new products crafted for style, quality, and innovation.
            </p>
          </div>

          {/* Countdown Boxes */}
          <div className="grid grid-cols-4 mt-10 gap-4">
            {[
              { value: "03", label: "Days" },
              { value: "24", label: "Hours" },
              { value: "12", label: "Mins" },
              { value: "36", label: "Sec" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white text-orange-500 rounded-lg py-5 px-10 flex flex-col items-center justify-center w-14"
              >
                <span className="text-2xl font-bold leading-none">{item.value}</span>
                <span className="text-[16px] font-medium mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-md transition relative flex flex-col justify-between"
            >
              {/* Discount & Wishlist */}
              <div className="flex justify-between items-center mb-3">
                <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-lg">
                  30%
                </span>
                <button className="text-red-400 bg-red-100 p-2 rounded-lg hover:text-red-500 transition">
                  <FaHeart size={14} />
                </button>
              </div>

              {/* Product Image */}
              <div className="flex justify-center items-center bg-gray-50 rounded-xl p-4">
                <Image
                  src="/images/iphone1.png"
                  alt="iPhone"
                  width={300}
                  height={200}
                  className=""
                />
              </div>

              {/* Product Info */}
              <h3 className="mt-3 text-gray-800 font-semibold text-xl">
                iPhone Series 16 Pro Max
              </h3>

              {/* Rating */}
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaStar className="text-yellow-400 mr-1" />
                (3.4)
              </div>

              {/* Price & Cart */}
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-orange-600 font-bold text-2xl block">
                    ৳1,00,500
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    ৳1,10,900
                  </span>
                </div>
                <button className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition">
                  <FaShoppingCart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
