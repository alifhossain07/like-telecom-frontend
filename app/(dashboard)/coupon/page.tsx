"use client";

import React, { useEffect, useState } from 'react';

import { LuGift, LuCopy, LuCheck } from "react-icons/lu";
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

interface Coupon {
  id: number;
  code: string;
  discount: number | string;
  discount_type: string;
  start_date: number;
  end_date: number;
  shop_name: string;
  coupon_discount_details: {
    min_buy: string;
    max_discount: string;
  };
}

// interface Meta {
//   current_page: number;
//   last_page: number;
//   total: number;
// }

export default function CouponPage() {
  const { accessToken } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  // Track which coupon code was just copied to show a checkmark
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const headers: Record<string, string> = {};
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const res = await axios.get('/api/coupons', { headers });
        if (res.data.success) {
          setCoupons(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [accessToken]);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Coupon code copied!");
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy code");
    });
  };

  // Helper to format timestamps to date string
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
      </div>

      <div className="space-y-6">
        {coupons.length === 0 ? (
          /* --- Empty State Section --- */
          <div className="bg-[#F3F4F6] rounded-2xl py-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <LuGift size={64} className="text-gray-900 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No Coupons Available!</h2>
          </div>
        ) : (
          /* --- Coupons Grid --- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="relative bg-[#FFF5F0] border border-orange-100 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch shadow-sm hover:shadow-md transition-shadow">
                {/* Left Side: Discount Info */}
                <div className="flex-1 flex flex-col justify-center items-start text-center sm:text-left space-y-1">
                  <h3 className="text-orange-600 font-bold text-lg sm:text-xl">
                    {coupon.discount_type === 'percent' ? `${coupon.discount}% OFF` : `${coupon.discount} OFF`}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    Min Spend: {coupon.coupon_discount_details.min_buy}
                  </p>
                  <div className="text-xs text-gray-500 space-y-0.5 mt-2">
                    <p>Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}</p>
                    <p>{coupon.shop_name}</p>
                  </div>
                </div>

                {/* Right Side: Code & Action (Dashed Divider for visual 'coupon' look) */}
                <div className="relative border-t sm:border-t-0 sm:border-l border-orange-200 w-full sm:w-auto pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-center items-center gap-3">
                  <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Code</span>
                  <div className="bg-white px-4 py-1.5 rounded-lg border border-orange-200 text-gray-800 font-mono font-bold text-sm tracking-wide">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => handleCopy(coupon.code, coupon.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors bg-white hover:bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200"
                  >
                    {copiedId === coupon.id ? (
                      <>
                        <LuCheck size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <LuCopy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                {/* Decorative 'Cutout' Circles for coupon effect (Optional css trick, simplified here) */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}