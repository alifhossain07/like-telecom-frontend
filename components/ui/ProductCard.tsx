"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import Link from "next/link";
import ProductOptionsModal from "./ProductOptionsModal";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

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

type Variant = {
  qty: number;
  [key: string]: unknown; // Allow other properties
};

type ProductDetails = {
  current_stock: number;
  variants: Variant[];
  [key: string]: unknown; // Allow other properties
};

export default function ProductCard({ product }: { product: Product }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { user, accessToken } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  // Fetch full product details
  useEffect(() => {
    if (product.slug) {
      const fetchProductDetails = async () => {
        try {
          // Use local proxy request to avoid CORS
          const res = await axios.get(`/api/products/${product.slug}`);
          // The proxy returns the product object directly
          if (res.data) {
            setProductDetails(res.data);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [product.slug]);

  // Log product details as requested
  useEffect(() => {
    if (productDetails) {
      console.log("Fetched Product Details:", productDetails);
    }
  }, [productDetails]);

  // Check if product is in wishlist on mount/user change
  useEffect(() => {
    if (user && accessToken && product.slug) {
      axios
        .get(`/api/wishlist/check/${product.slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setIsInWishlist(!!res.data.is_in_wishlist);
        })
        .catch((err) => {
          console.error("Error checking wishlist:", err);
          setIsInWishlist(false);
        });
    } else {
      setIsInWishlist(false);
    }
  }, [user, accessToken, product.slug]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add product in wishlist");
      return;
    }

    if (isWishlisting) return;

    setIsWishlisting(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const res = await axios.get(`/api/wishlist/remove/${product.slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data.is_in_wishlist === false) {
          setIsInWishlist(false);
          toast.success("Product removed from wishlist");
        }
      } else {
        // Add to wishlist
        const res = await axios.get(`/api/wishlist/add/${product.slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data.is_in_wishlist === true) {
          setIsInWishlist(true);
          toast.success("Product added to wishlist");
        }
      }
    } catch (error: unknown) {
      console.error("Wishlist operation failed:", error);
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-lg hover:shadow-md transition relative flex flex-col justify-between w-full max-w-sm mx-auto group">

        {/* ---------- IMAGE ---------- */}
        <Link
          href={`/${product.slug}`}
          className="relative flex justify-center items-center bg-gray-50  overflow-hidden mx-2 mt-2"
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
              className="object-contain sm:scale-95 md:scale-100 group-hover:scale-105 transition-transform duration-300"
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
              onClick={handleWishlistToggle}
              disabled={isWishlisting}
              className={`
                absolute top-1 right-1
                p-1 sm:p-1.5 md:p-2
                rounded-md
                transition shadow-sm
                ${isInWishlist
                  ? "text-white bg-red-500 hover:bg-red-600"
                  : "text-red-400 bg-red-50"
                }
                ${isWishlisting ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
              `}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {/* Out of Stock Overlay */}
            {(() => {
              if (!productDetails) return null; // Wait for data

              const stock = productDetails.current_stock ? Number(productDetails.current_stock) : 0;
              const hasVariantStock = productDetails.variants && productDetails.variants.length > 0
                ? productDetails.variants.some((v: Variant) => Number(v.qty) > 0)
                : false;

              // Show overlay only if both main stock and all variant stocks are 0
              if (stock === 0 && !hasVariantStock) {
                return (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base px-3 py-1 border-2 border-white rounded transform -rotate-12">
                      OUT OF STOCK
                    </span>
                  </div>
                );
              }
              return null;
            })()}

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
