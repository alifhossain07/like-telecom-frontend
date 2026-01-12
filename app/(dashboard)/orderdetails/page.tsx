"use client"
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuCopy } from "react-icons/lu";
import { useSearchParams } from 'next/navigation';

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string | null;
  postal_code: string | null;
  phone: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variation: string;
  price: string;
  tax: string;
  shipping_cost: string;
  coupon_discount: string;
  quantity: number;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  refund_section: boolean;
  refund_button: boolean;
  refund_label: string;
  refund_request_status: number;
}

interface OrderDetails {
  id: number;
  code: string;
  user_id: number;
  shipping_address: ShippingAddress;
  payment_type: string;
  pickup_point: string | null;
  shipping_type: string;
  shipping_type_string: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: string;
  plane_grand_total: number;
  coupon_discount: string;
  shipping_cost: string;
  subtotal: string;
  tax: string;
  date: string;
  cancel_request: boolean;
  manually_payable: boolean;
  items: OrderItem[];
  links: {
    details: string;
  };
}

interface OrderDetailsResponse {
  success: boolean;
  status: number;
  data: OrderDetails[];
}

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const isInvoiceMode = searchParams.get("invoice") === "true";

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("like_auth_token") : null;

      if (!token) {
        setError("Please login to view order details");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/orders/purchase-history-details/${orderId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const json: OrderDetailsResponse = await res.json();

        if (json.success && json.data && json.data.length > 0) {
          setOrderDetails(json.data[0]);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Order ID copied to clipboard!");
  };

  const handleGenerateInvoice = () => {
    if (orderId) {
      window.open(`/orderdetails?id=${orderId}&invoice=true`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Link
            href="/orders"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (isInvoiceMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        {/* No-print Action Bar */}
        <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 print:hidden">
          <Link
            href="/orders"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            ← Back to Orders
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#E9672B] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#d55b24] transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / Save as PDF
          </button>
        </div>

        <div className="bg-white p-8 max-w-[210mm] mx-auto print:p-0 invoice-container shadow-xl print:shadow-none" id="invoice-content">
          <div className="p-4 border border-gray-200 print:border-none">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-6 border-b pb-6">
              <div className="flex flex-col">
                <div className="mb-4">
                  {/* Using standard img for better compatibility with printers */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt="Like Telecom"
                    style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
                  />
                </div>

              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600 font-medium mb-1 text-sm">Invoice #: {orderDetails.code}</p>
                <p className="text-gray-600 text-sm">Date: {orderDetails.date}</p>
                <div className="mt-3 inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide print:border print:border-orange-500">
                  {orderDetails.payment_status_string}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
              <div className="text-gray-800 text-sm">
                <p className="font-bold text-base">{orderDetails.shipping_address.name}</p>
                <p>
                  {orderDetails.shipping_address.address},{" "}
                  {orderDetails.shipping_address.city}
                  {orderDetails.shipping_address.state && `, ${orderDetails.shipping_address.state}`}
                </p>
                <p>{orderDetails.shipping_address.country} {orderDetails.shipping_address.postal_code && `- ${orderDetails.shipping_address.postal_code}`}</p>
                <p className="mt-1 flex items-center gap-1">
                  <span>📱</span> {orderDetails.shipping_address.phone}
                </p>
                <p className="flex items-center gap-1">
                  <span>✉️</span> {orderDetails.shipping_address.email}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left bg-white text-xs">
                <thead className="bg-[#E9672B] text-white print:bg-[#E9672B] print:text-white">
                  <tr>
                    <th className="py-2 px-3 font-bold uppercase">Item Description</th>
                    <th className="py-2 px-3 font-bold uppercase text-center">Qty</th>
                    <th className="py-2 px-3 font-bold uppercase text-right">Unit Price</th>
                    <th className="py-2 px-3 font-bold uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-900">{item.product_name}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">{item.variation}</p>
                      </td>
                      <td className="py-3 px-3 text-center text-gray-700 font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-700 font-medium whitespace-nowrap">
                        {item.price}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end mb-6">
              <div className="w-64 bg-[#F9FAFB] p-4 rounded-lg border border-gray-100 print:bg-transparent print:border-none">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{orderDetails.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900">{orderDetails.shipping_cost}</span>
                  </div>
                  <div className="flex justify-between text-[#008D41]">
                    <span>Discount</span>
                    <span className="font-medium">-{orderDetails.coupon_discount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">{orderDetails.tax}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Grand Total</span>
                      <span className="font-bold text-[#E9672B] text-lg">{orderDetails.grand_total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t text-center text-gray-500 text-[10px] print:fixed print:bottom-0 print:left-0 print:w-full print:bg-white">
              <p className="font-medium text-gray-900">Thank you for your business!</p>
              <p className="mt-0.5">For questions concerning this invoice, please contact support@liketelecom.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      {/* Top Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Order ID with Dashed Border */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Order ID #{orderDetails.code}
              <button onClick={() => handleCopy(orderDetails.code)} className="text-gray-400 hover:text-gray-600">
                <LuCopy size={18} />
              </button>
            </h3>
            <p className="text-sm text-gray-500 font-medium">Placed on {orderDetails.date}</p>
          </div>
        </div>

        <button
          onClick={handleGenerateInvoice}
          className="bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          Generate Invoice
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4 mb-8">
        {orderDetails.items.map((item) => (
          <div key={item.id} className="bg-[#F9FAFB] rounded-xl p-4 flex gap-4 border border-gray-50">
            <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 border border-gray-100 p-2 relative">
              <Image
                src="https://via.placeholder.com/100"
                alt={item.product_name}
                width={100}
                height={100}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">{item.product_name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-2">
                {item.variation}
              </p>
              <p className="text-sm font-semibold text-gray-700">Qty : {item.quantity}</p>
              <p className="text-lg font-bold text-[#E9672B] mt-1">{item.price}</p>
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
            <p><span className="font-medium text-gray-800">Name :</span> {orderDetails.shipping_address.name}</p>
            <p><span className="font-medium text-gray-800">Mobile number :</span> {orderDetails.shipping_address.phone}</p>
            <p><span className="font-medium text-gray-800">Email :</span> {orderDetails.shipping_address.email}</p>
            <p className="leading-relaxed">
              <span className="font-medium text-gray-800">Address :</span> {orderDetails.shipping_address.address}
              {orderDetails.shipping_address.city && `, ${orderDetails.shipping_address.city}`}
              {orderDetails.shipping_address.state && `, ${orderDetails.shipping_address.state}`}
              {orderDetails.shipping_address.country && `, ${orderDetails.shipping_address.country}`}
              {orderDetails.shipping_address.postal_code && ` - ${orderDetails.shipping_address.postal_code}`}
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
              <span className="font-semibold text-gray-900">{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">{orderDetails.shipping_cost}</span>
            </div>
            <div className="flex justify-between text-[#008D41]">
              <span>Coupon Discount</span>
              <span className="font-semibold">{orderDetails.coupon_discount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold text-gray-900">{orderDetails.tax}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="font-bold text-gray-900">{orderDetails.grand_total}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Payment Status</span>
              <span className={`font-semibold ${orderDetails.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                {orderDetails.payment_status_string}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Delivery Status</span>
              <span className="font-semibold text-gray-900">{orderDetails.delivery_status_string}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Payment Type</span>
              <span className="font-semibold text-gray-900">{orderDetails.payment_type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}