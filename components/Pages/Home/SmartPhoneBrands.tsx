import Image from "next/image";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

const SmartPhoneBrands = () => {
  const brands = [
    { src: "/images/iphoneLogo.png", alt: "iPhone" },
    { src: "/images/samsunglogo.png", alt: "Samsung" },
    { src: "/images/oppologo.png", alt: "Oppo" },
    { src: "/images/realmelogo.png", alt: "Realme" },
    { src: "/images/huaweilogo.png", alt: "Huawei" },
    { src: "/images/onepluslogo.png", alt: "OnePlus" },
    { src: "/images/realmelogo.png", alt: "Realme" },
    { src: "/images/samsunglogo.png", alt: "Samsung" },
  ];

  return (
    <div className=" w-11/12 py-3  xl:p-10 flex flex-col md:flex-row mx-auto xl:items-center bg-gray-200 rounded-2xl">
      <div className=" py-5 md:w-1/2 px-4">
        <h1 className="text-xl  md:text-3xl md:text-left md:w-8/12 font-bold text-gray-800 mb-4">
          Discover The Latest Smartphones From Leading Brands
        </h1>
        <p className="text-gray-600 text-justify   mb-6 leading-relaxed">
          Stay Connected With Innovation! Explore Our Newest Collection of
          Smartphones From Top Global Brands — Built For Performance, Style,
          And Smart Living. Find the Perfect Match For Your Lifestyle and
          Experience Technology That Moves With You.
        </p>
        <button className="bg-orange-600 hover:bg-orange-700 text-white md:px-6   md:py-2 px-3 py-1 flex items-center rounded-3xl font-medium transition">
          Shop The New Arrivals Today{" "}
          <FiChevronRight className="text-white text-lg ml-1" />
        </button>
      </div>

      {/* Brand Logos */}
      <div className="grid grid-cols-2 items-center md:w-1/2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 ">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-xl flex items-center justify-center p-6 hover:shadow-lg transition cursor-pointer"
          >
            <Image
              src={brand.src}
              alt={brand.alt}
              width={180}
              height={100}
              className="object-contain w-auto h-16 md:h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartPhoneBrands;