"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
interface CartSidebarProps {
  externalOpen: boolean;
  setExternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CartItem {
  id: string | number; 
  name: string;
  img: string;
  price: number;
  oldPrice: number;
  qty: number;
  variant?: string;
  variantImage?: string;
  variantColor?: string;
  variantStorage?: string;
  variantRegion?: string;
}

export default function CartSidebar({ externalOpen, setExternalOpen }: CartSidebarProps) {
  const { cart, increaseQty, decreaseQty, removeFromCart, selectedItems, setSelectedItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const typedCart: CartItem[] = cart;

  // Auto-select all items by default whenever cart changes
  useEffect(() => {
    if (typedCart.length > 0) {
      const allItemIds = typedCart.map((item) => item.id);
      setSelectedItems((prev) => {
        // Check if there are any items not selected
        const missingItems = allItemIds.filter(id => !prev.includes(id));
        if (missingItems.length > 0) {
          // Add missing items to selection
          return [...new Set([...prev, ...missingItems])];
        }
        return prev;
      });
    } else {
      // If cart is empty, clear selections
      setSelectedItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedCart.length, typedCart.map(item => item.id).join(',')]);

  const toggleSelect = (id: string | number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === typedCart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(typedCart.map(item => item.id));
    }
  };

  // Only calculate totals for selected items
  const selectedCart = typedCart.filter((item) => selectedItems.includes(item.id));
  // Subtotal should use the base stroked price
  const subtotal = selectedCart.reduce((acc, item) => acc + item.oldPrice * item.qty, 0);
  // Discount is the difference between stroked and main price
  const discount = selectedCart.reduce(
    (acc, item) => acc + (item.oldPrice - item.price) * item.qty,
    0
  );
  // Total should reflect the already discounted main price (no double discount)
  const total = selectedCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      {/* Floating Cart Button */}
     <button
  onClick={() => setExternalOpen(true)}
  className="fixed hidden lg:flex flex-col right-0 top-1/2 -translate-y-1/2 z-[10001] shadow-xl rounded-l-3xl overflow-hidden transform hover:scale-105 transition"
>
  <div className="w-[90px] bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center py-3">
    {/* Icon */}
    <div className="w-8 h-8 flex items-center justify-center bg-white text-orange-500 rounded-full">
      <FaShoppingCart className="w-5 h-5" />
    </div>

    {/* Items count */}
    <span className="text-xs mt-2">
      *{mounted ? typedCart.length.toString().padStart(2, "0") : "00"} Items
    </span>
  </div>

  {/* Total */}
  <div className="bg-orange-500 text-white text-center py-2 font-semibold text-sm">
    {mounted
      ? `৳${typedCart.reduce((acc, item) => acc + item.price * item.qty, 0).toLocaleString()}`
      : "৳0"}
  </div>
</button>

      {/* Overlay */}
      {externalOpen && (
        <div onClick={() => setExternalOpen(false)} className="fixed inset-0 bg-black/30 z-[9998]" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[450px] bg-white shadow-xl z-[20000] transform transition-transform duration-300 ${
          externalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 w-full bg-orange-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
 <h2 className="text-lg font-semibold">Your Cart</h2>
          <span className="text-sm ">
              (*{mounted ? typedCart.length.toString().padStart(2, "0") : "00"} Items)
            </span>
          </div>
         
          <button onClick={() => setExternalOpen(false)} className="text-white text-2xl">
            ✕
          </button>
        </div>

        

        <div
  className="p-4 mt-14 overflow-y-auto space-y-3"
  style={{ height: "calc(100vh - 260px)" }}
>
  {typedCart.map((item) => (
    <div
      key={item.id}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleSelect(item.id)}
        className={`mt-1 w-5 h-5 flex items-center justify-center rounded-md border flex-shrink-0 transition ${
          selectedItems.includes(item.id)
            ? "bg-orange-500 border-orange-500"
            : "border-gray-300"
        }`}
      >
        {selectedItems.includes(item.id) && (
          <span className="text-white text-xs font-bold">✓</span>
        )}
      </button>

      {/* Image */}
      <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <Image
          src={item.variantImage || item.img}
          alt={item.name}
          width={70}
          height={70}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
          {item.name}
        </h3>

        {/* Display variant in same format as checkout */}
        {item.variant && (
          <p className="text-xs text-gray-500 mt-1">
            {item.variant}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-orange-600 font-semibold text-sm">
            {mounted ? `৳${item.price * item.qty}` : "৳0"}
          </span>
          <span className="text-xs text-gray-400 line-through">
            {mounted ? `৳${item.oldPrice * item.qty}` : "৳0"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQty(item.id)}
              className="w-6 h-6 flex items-center justify-center rounded-full border text-sm hover:bg-gray-100"
            >
              −
            </button>

            <span className="text-sm font-medium w-5 text-center">
              {item.qty}
            </span>

            <button
              onClick={() => increaseQty(item.id)}
              className="w-6 h-6 flex items-center justify-center rounded-full border text-sm hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 text-lg"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* Bottom area */}
<div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
  <div className="p-4 flex flex-col gap-4">

    {/* Top row: Select all + Totals */}
    <div className="flex items-start justify-between gap-4">

      {/* Select All */}
      <button
        onClick={toggleSelectAll}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <span
          className={`w-5 h-5 flex items-center justify-center rounded-md border transition ${
            selectedItems.length === typedCart.length && typedCart.length > 0
              ? "bg-orange-500 border-orange-500"
              : "border-gray-400"
          }`}
        >
          {selectedItems.length === typedCart.length && typedCart.length > 0 && (
            <span className="text-white text-xs font-bold">✓</span>
          )}
        </span>
        Select all
      </button>

      {/* Totals */}
      <div className="text-sm w-[60%] max-w-[240px]">
        <div className="flex justify-between text-gray-600 mb-1">
          <span>Sub-total</span>
          <span>৳{mounted ? subtotal.toLocaleString() : "0"}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Discount</span>
          <span>৳{mounted ? discount.toLocaleString() : "0"}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t font-semibold text-base">
          <span>Total</span>
          <span className="text-orange-600">
            ৳{mounted ? total.toLocaleString() : "0"}
          </span>
        </div>
      </div>
    </div>

    {/* Checkout Button */}
    <Link href="/checkout" onClick={() => setExternalOpen(false)}>
      <button
        disabled={selectedItems.length === 0}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          selectedItems.length > 0
            ? "bg-orange-500 text-white hover:bg-orange-400 active:scale-[0.99]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Proceed to Checkout
      </button>
    </Link>

  </div>
</div>
      </aside>
    </>
  );
}
