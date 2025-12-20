"use client"
import React from 'react';
import { LuCopy } from "react-icons/lu";
import Link from 'next/link';
const OrderCard = ({ orderId, date }) => {
  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    alert("Order ID copied to clipboard!");
  };

  return (
    <div className="bg-[#F3F4F6] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      {/* Order ID Section with Dashed Border */}
      <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px] bg-transparent">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Order ID #{orderId}
          </h3>
          <p className="text-sm text-gray-500 font-medium">Placed on {date}</p>
        </div>
        <button 
          onClick={() => handleCopy(orderId)}
          className="text-gray-500 hover:text-gray-800 transition-colors p-2"
          title="Copy Order ID"
        >
          <LuCopy size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link  href="/orderdetails"  className="flex-1 md:flex-none bg-[#D1D5DB] hover:bg-gray-400 text-gray-800 font-bold px-8 py-2.5 rounded-lg transition-colors">
          Details
        </Link>
        <button className="flex-1 md:flex-none bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm">
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const orders = [
    { id: "131025011449", date: "13 October 2025" },
    { id: "131025011449", date: "13 October 2025" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
      </div>

      {/* List of Orders */}
      <div className="space-y-2">
        {orders.map((order, index) => (
          <OrderCard key={index} orderId={order.id} date={order.date} />
        ))}
      </div>
    </div>
  );
}