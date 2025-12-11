"use client";

// import { useCart } from "@/app/context/CartContext";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
// import { LuShoppingBag } from "react-icons/lu";
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
  // const { addToCart, setSelectedItems } = useCart();
  // const router = useRouter();
  const [optionsOpen, setOptionsOpen] = useState(false);

  

  
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-lg hover:shadow-md transition relative flex flex-col justify-between w-[304px]">
        {/* Discount + Wishlist */}
        <div className="flex justify-between items-center mb-3">
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
          className="flex justify-center items-center bg-gray-50 rounded-xl p-4"
        >
          <div className="relative w-[200px] h-[160px]">
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
          <h3 className="mt-3 text-gray-800 h-[50px] font-medium mb-3 text-lg md:text-xl line-clamp-3">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center text-sm text-gray-500 mt-1">3
          <FaStar className="text-yellow-400 mr-1" /> ({product.rating})
        </div>

        {/* Specs (same functional logic, new look) */}
       

        {/* Price + Add to Cart */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-orange-600 font-bold md:text-2xl text-xl block">
              ৳{product.price}
            </span>

            <span className="text-gray-400 line-through md:text-lg text-md">
              ৳{product.oldPrice}
            </span>
          </div>

          <button
            onClick={() => setOptionsOpen(true)}
            className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition"
          >
            <FaCartPlus size={20} />
          </button>
        </div>

        {/* Buy Now button (kept from your old layout) */}
        
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
