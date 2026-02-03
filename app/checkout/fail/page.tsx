"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
// import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderFailContent() {
    const [loading, setLoading] = useState(true);
    const [orderIdState, setOrderIdState] = useState<string | null>(null);
    const [customer, setCustomer] = useState<{ name: string; mobile: string; address?: string } | null>(null);
    const [totals, setTotals] = useState<{
        total: number;
    } | null>(null);

    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id") || searchParams.get("orderId");

    useEffect(() => {
        try {
            const raw = typeof window !== "undefined" ? sessionStorage.getItem("lastOrder") : null;
            if (raw) {
                const parsed = JSON.parse(raw);
                setOrderIdState(orderId || parsed?.orderId || null);
                if (parsed?.customer) {
                    setCustomer({
                        name: parsed.customer.name || "",
                        mobile: parsed.customer.mobile || "",
                        address: parsed.customer.address || ""
                    });
                }
                if (parsed?.totals) {
                    setTotals({ total: parsed.totals.total });
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
        <div className="w-full flex justify-center py-10 px-4">
            <div className="w-full max-w-2xl border rounded-2xl p-6 md:p-12 bg-white shadow-sm text-center">

                {/* Loading Spinner */}
                {loading && (
                    <div className="w-full flex justify-center py-6">
                        <div className="h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Failure Header */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                            Order Payment Failed!
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base mb-8">
                            We&apos;re sorry, but there was an issue processing your payment. Please try again or use a different method.
                        </p>

                        {/* Order Brief Info */}
                        <div className="w-full bg-red-50 rounded-2xl border border-red-100 overflow-hidden text-left mb-8">
                            <div className="p-5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-red-800/60 mb-4 border-b border-red-100 pb-2">Order Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-red-400 font-bold">Order ID</p>
                                        <p className="text-sm font-semibold text-gray-800">{orderIdState || "N/A"}</p>
                                    </div>
                                    {totals && (
                                        <div>
                                            <p className="text-[10px] uppercase text-red-400 font-bold">Total Amount</p>
                                            <p className="text-sm font-semibold text-gray-800">৳{totals.total.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {customer && (
                                        <div className="col-span-1 md:col-span-2">
                                            <p className="text-[10px] uppercase text-red-400 font-bold">Customer</p>
                                            <p className="text-sm font-semibold text-gray-800">{customer.name} ({customer.mobile})</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Help/Contact Info */}
                        {/* <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-sm text-gray-600">
                            Need help? Contact our support at <span className="text-orange-600 font-bold">+--854789956</span> or use the chat widget.
                        </div> */}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base">
                            <Link
                                href="/checkout"
                                className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition-all active:scale-95"
                            >
                                Retry Payment
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function OrderFail() {
    return (
        <Suspense fallback={<div className="w-full py-10 text-center">Loading...</div>}>
            <OrderFailContent />
        </Suspense>
    );
}
