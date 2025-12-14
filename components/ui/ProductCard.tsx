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
        {/* Discount + Wishlist */}
        <div className="flex justify-between items-center p-2">
          <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-lg">
            {product.discount}
          </span>
          <button className="text-red-400 bg-red-100 p-2 rounded-lg hover:text-red-500 transition">
            <FaHeart size={14} />
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/${product.slug}`}
          className="flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden mx-2"
        >
          <div className="w-full aspect-[5/4] relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Title */}
        <Link href={`/${product.slug}`}>
          <h3 className="mt-3 mx-2 text-gray-800 font-medium text-base sm:text-sm md:text-lg  xl:text-xl 2xl:text-xl line-clamp-3">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center text-sm text-gray-500 mt-1 mx-2">
          <FaStar className="text-yellow-400 mr-1" /> ({product.rating})
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-4 flex items-center justify-between mx-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-orange-600 font-bold text-lg sm:text-base md:text-xl lg:text-2xl">
              ৳{product.price}
            </span>
            <span className="text-gray-400 line-through text-sm sm:text-xs md:text-md lg:text-lg">
              ৳{product.oldPrice}
            </span>
          </div>
          <button
            onClick={() => setOptionsOpen(true)}
            className="bg-black text-white p-2 sm:p-1 md:p-2 lg:p-3 rounded-md hover:bg-gray-800 transition"
          >
            <FaCartPlus size={20} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <ProductOptionsModal
        slug={product.slug}
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
}
