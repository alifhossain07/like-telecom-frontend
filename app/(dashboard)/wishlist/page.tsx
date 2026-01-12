"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaStar, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface WishlistItem {
  id: number;
  product: {
    slug: string;
    name: string;
    rating: number;
    base_price: string;
    old_price?: string;
    thumbnail_image: string;
  };
}

export default function WishlistPage() {
  const { accessToken } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!accessToken) return;
      try {
        const res = await axios.get('/api/wishlist', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data.success || res.status === 200) {
          // Backend API seems to return { data: [...] } for wishlist
          setWishlistItems(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [accessToken]);

  const handleRemove = async (slug: string) => {
    try {
      const res = await axios.get(`/api/wishlist/remove/${slug}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.is_in_wishlist === false) {
        toast.success("Product removed from wishlist");
        // Re-fetch or update local state
        setWishlistItems(prev => prev.filter(item => item.product.slug !== slug));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove product");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center mb-8 border border-gray-50">
          <div className="relative mb-4">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <div className="relative">
                <AiOutlineShoppingCart size={60} className="text-gray-700" />
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full border-2 border-white w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                  ✕
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Your wishlist is empty!</h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Your wishlist is waiting to be filled! Find something you love and save it here for later.
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.product.slug)}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-red-50 text-red-500 p-2 rounded-full shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from wishlist"
              >
                <FaTrash size={14} />
              </button>

              {/* Image Container */}
              <Link href={`/${item.product.slug}`}>
                <div className="relative p-4 bg-[#F3F4F6] m-3 rounded-lg flex justify-center h-52">
                  <Image
                    src={item.product.thumbnail_image}
                    alt={item.product.name}
                    width={200}
                    height={250}
                    className="object-contain"
                  />
                  {/* Save Badge (Calculated if possible, otherwise skip or use static) */}
                  {/* <div className="absolute top-0 left-0 bg-[#008D41] text-white text-xs font-bold px-3 py-1.5 rounded-br-lg rounded-tl-lg">
                    Sale
                  </div> */}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4 pt-0">
                <Link href={`/${item.product.slug}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-orange-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>


                <div className="flex items-center gap-1 mb-3">
                  <FaStar className="text-yellow-400" size={12} />
                  <span className="text-xs text-gray-500">({item.product.rating})</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-[#E9672B]">{item.product.base_price}</span>
                  {/* {item.product.old_price && (
                    <span className="text-sm text-gray-400 line-through">{item.product.old_price}</span>
                  )} */}
                </div>

                <Link href={`/${item.product.slug}`}>
                  <button className="w-full bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold py-2 rounded-lg transition-colors shadow-sm">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
