"use client"
import React from 'react';
import Link from 'next/link';
import { LuCopy } from "react-icons/lu";

export default function OrderDetailsPage() {
  const orderId = "131025011449";

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    alert("Order ID copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link 
          href="/orders" 
          className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          Go Back
        </Link>
      </div>

      {/* Top Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Order ID with Dashed Border */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Order ID #{orderId}
              <button onClick={() => handleCopy(orderId)} className="text-gray-400 hover:text-gray-600">
                <LuCopy size={18} />
              </button>
            </h3>
            <p className="text-sm text-gray-500 font-medium">Placed on 13 October 2025</p>
          </div>
        </div>

        <button className="bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
          Generate Invoice
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4 mb-8">
        {[1, 2].map((item) => (
          <div key={item} className="bg-[#F9FAFB] rounded-xl p-4 flex gap-4 border border-gray-50">
            <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 border border-gray-100 p-2">
              <img 
                src="https://via.placeholder.com/100" // Replace with Galaxy S25 image
                alt="Galaxy S25 Ultra"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">Galaxy S25 Ultra</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-2">
                Glass front (Corning Gorilla Armor 2), glass back (Corning Gorilla Armor 2), titanium frame (grade 5)
              </p>
              <p className="text-sm font-semibold text-gray-700">Qty : 01</p>
              <p className="text-lg font-bold text-[#E9672B] mt-1">৳ 2600</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Address and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Shipping address
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Name :</span> amanulla 27</p>
            <p><span className="font-medium text-gray-800">Mobile number :</span> 01825479320</p>
            <p><span className="font-medium text-gray-800">Email :</span> amanulla@gmail.com</p>
            <p className="leading-relaxed">
              <span className="font-medium text-gray-800">Address :</span> Mohammadpur, Dhaka, Gaibandha Sadar, Gaibandha
            </p>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Total Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Price</span>
              <span className="font-semibold text-gray-900">৳ 72,999</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">৳ 10</span>
            </div>
            <div className="flex justify-between text-[#008D41]">
              <span>Coupon Discount</span>
              <span className="font-semibold">৳ 0</span>
            </div>
            <div className="flex justify-between text-[#008D41]">
              <span>Applied Point</span>
              <span className="font-semibold">৳ 0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Subtotal</span>
              <span className="font-bold text-gray-900">৳ 72,548.6</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span className="font-medium">Gateway Charge</span>
              <span className="font-semibold">৳ 10,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid Amount</span>
              <span className="font-semibold text-gray-900">৳ 10</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-red-600">
              <span className="font-bold text-lg">Due</span>
              <span className="font-bold text-lg">৳ 74,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}