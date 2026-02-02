"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaFacebookMessenger, FaPhoneAlt, FaTimes } from "react-icons/fa";
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
  const { cart, increaseQty, decreaseQty, removeFromCart, selectedItems, setSelectedItems, cartOpen, setCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [showChatBubble, setShowChatBubble] = useState(true);
  const [socialLinks, setSocialLinks] = useState<{ type: string; value: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    updateCompareCount();

    // Fetch social numbers
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/social-numbers", { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };
    fetchSocialLinks();

    // Listen for storage changes to update count (for cross-tab updates)
    const handleStorageChange = () => {
      updateCompareCount();
    };

    // Listen for custom events when compare is updated in same window
    const handleCompareUpdate = () => {
      updateCompareCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("compareUpdated", handleCompareUpdate);

    // Also poll periodically to catch any changes
    const interval = setInterval(updateCompareCount, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("compareUpdated", handleCompareUpdate);
      clearInterval(interval);
    };
  }, []);

  const updateCompareCount = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compareProducts");
      if (stored) {
        try {
          const compareProducts: string[] = JSON.parse(stored);
          setCompareCount(compareProducts.length);
        } catch {
          setCompareCount(0);
        }
      } else {
        setCompareCount(0);
      }
    }
  };

  const handleCompareClick = () => {
    router.push("/compare");
  };

  // Sync cartOpen from context with externalOpen prop
  useEffect(() => {
    if (cartOpen && !externalOpen) {
      setExternalOpen(true);
    }
  }, [cartOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync externalOpen prop with cartOpen context when closed externally
  useEffect(() => {
    if (!externalOpen && cartOpen) {
      setCartOpen(false);
    }
  }, [externalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
          const combined = [...prev, ...missingItems];
          return Array.from(new Set(combined));
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
        className="fixed hidden lg:flex items-center justify-center
                   right-2 top-1/2 -translate-y-1/2 z-[10001]
                   rounded-l-full overflow-visible
                   transform hover:scale-105 transition"
      >
        <div className="relative">
          {/* Cart Icon */}
          <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-full">
            <FaShoppingCart className="w-6 h-6" />
          </div>

          {/* Item Count Badge */}
          <span className="absolute -top-1 -right-1
                           min-w-[20px] h-[20px]
                           flex items-center justify-center
                           bg-red-600 text-white text-[10px] font-semibold
                           rounded-full px-1">
            {mounted ? typedCart.length : 0}
          </span>
        </div>
      </button>

      {/* Floating Compare Button */}
      <button
        onClick={handleCompareClick}
        className="fixed hidden lg:flex items-center justify-center
                   right-2 top-[calc(50%+38px)] -translate-y-0 z-[10001]
                   rounded-l-full overflow-visible
                   transform hover:scale-105 transition"
      >
        <div className="relative">
          {/* Compare Icon */}
          <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-full">
            <FaCodeCompare className="w-6 h-6" />
          </div>

          {/* Compare Count Badge */}
          {mounted && compareCount > 0 && (
            <span className="absolute -top-1 -right-1
                             min-w-[20px] h-[20px]
                             flex items-center justify-center
                             bg-red-600 text-white text-[10px] font-semibold
                             rounded-full px-1">
              {compareCount}
            </span>
          )}
        </div>
      </button>



      {/* ================= FLOATING CHAT WIDGET ================= */}
      <div className="fixed bottom-20 md:bottom-6 right-3 z-[20000]  flex flex-col items-end gap-3">

        {/* Expanded Buttons (Messenger, WhatsApp, Phone) */}
        <div className={`flex flex-col gap-3 transition-all duration-300 transform ${chatOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-0 pointer-events-none h-0"
          }`}>
          {/* Messenger */}
          <a
            href={socialLinks.find(link => link.type === "messenger_link")?.value || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <FaFacebookMessenger className="text-2xl" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${socialLinks.find(link => link.type === "whatsapp_number")?.value?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <FaWhatsapp className="text-2xl" />
          </a>

          {/* Phone */}
          <a
            href={`tel:${socialLinks.find(link => link.type === "phone_number")?.value?.replace(/\D/g, '')}`}
            className="w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <FaPhoneAlt className="text-xl" />
          </a>
        </div>

        {/* Main Avatar / Close Button */}
        <div className="relative  group flex items-center gap-3">

          {/* Text Bubble (Only visible when collapsed and not manually closed) */}
          <div className={`bg-white shadow-xl text-gray-700 px-4 py-2 rounded-xl rounded-tr-none border border-gray-100 transition-all duration-300 origin-right ${!chatOpen && showChatBubble ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-4 pointer-events-none"
            }`}>
            <div className="flex items-center gap-2 relative">
              <span className="text-sm font-medium">Sir, How can I help?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatBubble(false);
                }}
                className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 text-[10px]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 relative ${chatOpen ? "bg-blue-600 rotate-90" : "bg-white hover:scale-105 border-2 border-orange-500"
              }`}
          >
            {/* Collapsed State: Avatar Image */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${chatOpen ? "opacity-0" : "opacity-100"}`}>
              <div className="w-full h-full relative">
                {/* Image Container with Overflow Hidden */}
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                    alt="Support"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Green Dot - Outside overflow-hidden but inside button */}
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
                </span>
              </div>
            </div>

            {/* Expanded State: Close Icon */}
            <div className={`absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 rounded-full overflow-hidden ${chatOpen ? "opacity-100" : "opacity-0 invisible"}`}>
              <FaTimes className="text-2xl" />
            </div>
          </button>
        </div>
      </div>



      {/* Overlay */}
      {externalOpen && (
        <div onClick={() => {
          setExternalOpen(false);
          setCartOpen(false);
        }} className="fixed inset-0 bg-black/30 z-[9998]" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[450px] bg-white shadow-xl z-[20000] transform transition-transform duration-300 ${externalOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="absolute top-0 left-0 w-full bg-orange-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <span className="text-sm ">
              (*{mounted ? typedCart.length.toString().padStart(2, "0") : "00"} Items)
            </span>
          </div>

          <button onClick={() => {
            setExternalOpen(false);
            setCartOpen(false);
          }} className="text-white text-2xl">
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
                className={`mt-1 w-5 h-5 flex items-center justify-center rounded-md border flex-shrink-0 transition ${selectedItems.includes(item.id)
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
                  className={`w-5 h-5 flex items-center justify-center rounded-md border transition ${selectedItems.length === typedCart.length && typedCart.length > 0
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
            <Link href="/checkout" onClick={() => {
              setExternalOpen(false);
              setCartOpen(false);
            }}>
              <button
                disabled={selectedItems.length === 0}
                className={`w-full py-3 rounded-xl font-semibold transition ${selectedItems.length > 0
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
