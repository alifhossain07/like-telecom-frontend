"use client";

import Image from "next/image";
import { useState } from "react";
import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import Link from "next/link";
import ProductOptionsModal from "./ProductOptionsModal";

type Spec = {
  icon: string;
  text: string;
};

type Product = {
  id: number;
  slug: string;
  image: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string | number;
  rating: number | string;
  reviews: number | string;
  featured_specs?: Spec[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-lg hover:shadow-md transition relative flex flex-col justify-between w-full max-w-sm mx-auto">

        {/* ---------- IMAGE ---------- */}
        <Link
          href={`/${product.slug}`}
          className="relative flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden mx-2 mt-2"
        >
          <div
            className="
              w-full relative
              aspect-[1/1]        /* mobile: compact square */
              sm:aspect-[4/3]     /* tablet */
              md:aspect-[5/4]     /* desktop */
            "
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain sm:scale-95 md:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Discount Badge */}
            <span
              className="
                absolute top-1 left-1
                bg-green-100 text-green-600
                text-[8px] sm:text-xs md:text-sm
                font-semibold
                px-1.5 py-0.5 sm:px-2 sm:py-1
                rounded-md
              "
            >
              {product.discount}
            </span>

            {/* Wishlist */}
            <button
              className="
                absolute top-1 right-1
                text-red-400 bg-red-100
                p-1 sm:p-1.5 md:p-2
                rounded-md
                hover:text-red-500 transition
              "
            >
              <FaHeart className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
          </div>
        </Link>

        {/* ---------- TITLE ---------- */}
        <Link href={`/${product.slug}`}>
          <h3 className="mt-3 mx-2 text-gray-800 font-medium text-[14px] sm:text-sm md:text-lg xl:text-[18px] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* ---------- PRICE ---------- */}
        <div className="flex flex-col px-2 py-1 gap-1">
          <span className="text-orange-600 font-bold text-lg sm:text-base md:text-xl lg:text-2xl">
            ৳{product.price}
          </span>
          <span className="text-gray-400 line-through text-xs sm:text-sm md:text-md">
            ৳{product.oldPrice}
          </span>
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="flex items-center justify-between mx-2 mb-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <FaStar className="text-yellow-400 mr-1" />
            ({product.rating})
          </div>

          <button
            onClick={() => setOptionsOpen(true)}
            className="
              bg-black text-white
              p-2 sm:p-1.5 md:p-2.5
              rounded-md
              hover:bg-gray-800 transition
            "
          >
            <FaCartPlus size={18} />
          </button>
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      <ProductOptionsModal
        slug={product.slug}
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
}
