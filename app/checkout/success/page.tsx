"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/app/lib/format-utils";

export default function OrderComplete() {
  const [loading, setLoading] = useState(true);
  const [orderIdState, setOrderIdState] = useState<string | null>(null);
  const [orderCodeState, setOrderCodeState] = useState<string | null>(null);
  const [customer, setCustomer] = useState<{ name: string; mobile: string; address?: string } | null>(null);
  const [items, setItems] = useState<Array<{ id: string | number; name: string; qty: number; price: number; variant?: string | null }>>([]);
  const [totals, setTotals] = useState<{
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    promoDiscount: number;
    total: number;
    paid_amount?: number;
    due_amount?: number;
    payment_status?: string;
  } | null>(null);
  const [shipping, setShipping] = useState<{
    method: string;
    methodLabel: string;
    charge: number;
  } | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("lastOrder") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrderIdState(orderId || parsed?.orderId || null);
        setOrderCodeState(parsed?.orderCode || null);
        if (parsed?.customer) {
          setCustomer({
            name: parsed.customer.name || "",
            mobile: parsed.customer.mobile || "",
            address: parsed.customer.address || ""
          });
        }
        if (Array.isArray(parsed?.items)) {
          setItems(parsed.items);
        }
        if (parsed?.totals) {
          setTotals(parsed.totals);
        }
        if (parsed?.shipping) {
          setShipping(parsed.shipping);
        }
      } else {
        setOrderIdState(orderId);
      }
    } catch {
      setOrderIdState(orderId);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <Suspense fallback={<div className="w-full py-10 text-center">Loading...</div>}>
      <div className="w-full flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl border rounded-2xl p-6 md:p-12 bg-white shadow-sm text-center">

          {/* Loading Spinner */}
          {loading && (
            <div className="w-full flex justify-center py-6">
              <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && (
            <>
              {/* Success Header */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/tick.png"
                  alt="Success"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                Order Completed!
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-8">
                Thank you. Your order has been received and is being processed.
              </p>

              {/* Unified Order Box */}
              <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden text-left mb-8">
                {/* Header/Customer Info Section */}
                <div className="p-5 border-b border-gray-200 bg-gray-100/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Order Details</h3>
                    {totals?.payment_status && (
                      <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${totals.payment_status === "Paid" ? "bg-green-100 text-green-700" :
                        totals.payment_status === "Partially Paid" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                        {totals.payment_status}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Order ID</p>
                      <p className="text-sm font-semibold text-gray-800">{orderIdState || "N/A"}</p>
                    </div>
                    {orderCodeState && (
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">Order Code</p>
                        <p className="text-sm font-semibold text-gray-800">{orderCodeState}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Customer</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{customer?.name || "N/A"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Contact</p>
                      <p className="text-sm font-semibold text-gray-800">{customer?.mobile || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Address</p>
                      <p className="text-sm font-semibold text-gray-800 break-words">{customer?.address || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Items Purchased</h3>
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No item details available.</p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex gap-2 items-center">
                              <span className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-xs">
                                {it.qty}x
                              </span>
                              <span className="font-medium text-gray-700">{it.name}</span>
                            </div>
                            {it.variant && it.variant.trim() !== "" && (
                              <p className="text-xs text-gray-500 ml-8">{it.variant}</p>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 ml-4 font-mono">৳{formatPrice(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="px-5 pb-5 border-t border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 pt-4">Billing Summary</h3>
                  {totals ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">৳{formatPrice(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold">৳{formatPrice(totals.discount)}</span>
                      </div>
                      {totals.promoDiscount > 0 && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>Promo Discount</span>
                          <span className="font-semibold">-৳{formatPrice(totals.promoDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">{shipping?.methodLabel || "Delivery"}</span>
                        <span className="font-semibold">৳{formatPrice(shipping?.charge ?? totals.deliveryCharge)}</span>
                      </div>

                      {/* Payment Progress Section */}
                      <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-green-700 font-bold">
                          <span>Advance Paid</span>
                          <span>৳{formatPrice(totals.paid_amount ?? 0)}</span>
                        </div>
                        <div className="flex justify-between text-red-600 font-bold">
                          <span>Due Amount</span>
                          <span>৳{formatPrice(totals.due_amount ?? totals.total)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 mt-2 border-t font-black text-orange-600 text-lg italic">
                        <span>Grand Total</span>
                        <span>৳{formatPrice(totals.total)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Summary unavailable.</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto bg-orange-500 text-white px-10 py-2 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all active:scale-95"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/trackorder"
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-10 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Track Order
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}