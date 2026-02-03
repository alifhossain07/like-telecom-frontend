"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface OrderDetails {
    id: number;
    code: string;
    date: number;
    grand_total: number;
    delivery_status: string;
    payment_type: string;
    shipping_address: {
        name: string;
        email: string;
        address: string;
    };
    additional_info: {
        shipping_method_label: string;
    };
    order_details: Array<{
        id: number;
        product: {
            name: string;
        };
        quantity: number;
    }>;
}

const TrackOrderPage = () => {
    const [orderCode, setOrderCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderDetails | null>(null);

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderCode.trim()) {
            toast.error("Please enter an order ID");
            return;
        }

        setLoading(true);
        try {
            // Browser fetch cannot have a body for GET requests.
            // We pass it as a query param to our proxy, which will handle the GET with body to the backend.
            const response = await fetch(`/api/order/track?order_code=${encodeURIComponent(orderCode.trim())}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success && data.order) {
                setOrder(data.order);
            } else {
                toast.error(data.message || "Order not found");
                setOrder(null);
            }
        } catch (error) {
            console.error("Error tracking order:", error);
            toast.error("Failed to track order. Please try again.");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(",", "");
    };

    return (
        <div className="bg-white min-h-screen pb-20 pt-1">
            {/* Header Banner */}
            <div className="bg-[#262626] py-10 mb-12">
                <div className="w-11/12 mx-auto text-center">
                    <h1 className="text-3xl md:text-3xl font-bold text-white uppercase">
                        Track Your Order
                    </h1>
                </div>
            </div>

            {/* Search Section */}
            <div className="w-11/12 md:w-10/12 lg:w-1/2 mx-auto mb-16">
                <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        placeholder="Enter your code"
                        className="flex-1 bg-[#F9F9F9] border border-gray-200 rounded-lg px-5 py-2 text-lg outline-none focus:border-orange-500 transition-all font-medium text-gray-700"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#EB6420] text-white px-10 py-2 rounded-lg text-md font-bold hover:bg-[#D5571A] transition-all disabled:bg-gray-400 shadow-sm uppercase tracking-wide"
                    >
                        {loading ? "Tracking..." : "Track Order"}
                    </button>
                </form>
                <p className="text-[#888888] text-sm leading-relaxed max-w-2xl mx-auto md:text-center lg:text-left">
                    To track your order please enter your Order ID in the box below and press the &apos;Track Order&apos; button. This was given to you on your receipt and in the confirmation email you should have received.
                </p>
            </div>

            {/* Order Details Display */}
            {order && (
                <div className="w-11/12 mx-auto animate-fadeIn max-w-6xl">
                    {/* Order Summary Card */}
                    <div className="border border-gray-200 rounded-xl shadow-sm mb-12 overflow-hidden bg-white">
                        <div className="bg-[#FBFBFB] p-6 border-b border-gray-100">
                            <h2 className="md:text-2xl text-xl font-bold text-[#333333]">Order Summary</h2>
                        </div>

                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                            <div className="space-y-5">
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-40 text-[#555555] font-bold md:text-base text-sm">Order Code::</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium">{order.code}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-40 text-[#555555] font-bold md:text-base text-sm">Customer:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium">{order.shipping_address.name}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-40 text-[#555555] font-bold     md:text-base text-sm">Email:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium">{order.shipping_address.email}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-40 text-[#555555] font-bold md:text-base text-sm">Shipping address:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium">{order.shipping_address.address}</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-44 text-[#555555] font-bold          md:text-base text-sm">Order date:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium">{formatDate(order.date)}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-44 text-[#555555] font-bold md:text-base text-sm">Total order amount:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-bold">৳{order.grand_total.toLocaleString()}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-44 text-[#555555] font-bold md:text-base text-sm">Shipping method:</span>
                                    <span className="flex-1 text-[#666666]      md:text-base text-sm font-medium uppercase">{order.additional_info.shipping_method_label ? order.additional_info.shipping_method_label.replace(/_/g, " ") : "Flat shipping rate"}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-44 text-[#555555] font-bold md:text-base text-sm">Payment method:</span>
                                    <span className="flex-1 text-[#666666] md:text-base text-sm font-medium uppercase">{order.payment_type.replace(/_/g, " ")}</span>
                                </div>
                                <div className="flex border-b border-gray-50 pb-2">
                                    <span className="w-44 text-[#555555] font-bold md:text-base text-sm">Delivery Status:</span>
                                    <span className="flex-1 text-[#EB6420] capitalize font-bold">{order.delivery_status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product List Table */}
                    <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white mb-20">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FBFBFB]">
                                    <th className="px-10 py-5 text-[#333333] font-bold md:text-base text-sm border-b border-gray-100">Product Name</th>
                                    <th className="px-10 py-5 text-[#333333] font-bold md:text-base text-sm border-b border-gray-100">Quantity</th>
                                    <th className="px-10 py-5 hidden md:block text-[#333333] font-bold md:text-base text-sm border-b border-gray-100">Shipped By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.order_details.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-10 py-6 text-[#666666] font-medium  md:text-base text-sm">{item.product.name}</td>
                                        <td className="px-10 py-6 text-[#666666] font-medium md:text-base text-sm">{item.quantity}</td>
                                        <td className="px-10 hidden md:block py-6 text-[#666666] font-medium md:text-base text-sm">Like Telecom</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrderPage;
