"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

interface PickupPoint {
    id: number;
    name: string;
    address: string;
    phone: string;
    opening_hours: string;
    closed_day: string;
    short_description: string;
    description: string;
    embedded_map_link: string;
    images: string[];
}

const StoreDetailsPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [store, setStore] = useState<PickupPoint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                const response = await axios.get(`/api/pickup-point/${id}`);
                if (response.data && response.data.data) {
                    setStore(response.data.data);
                } else {
                    setError("Store not found or failed to load details.");
                }
            } catch (err) {
                console.error("Error fetching store details:", err);
                setError("Something went wrong while fetching store details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E8A44]"></div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Store not found"}</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#1E8A44] text-white px-6 py-2 rounded-md hover:bg-[#166933] transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FB] min-h-screen pb-20">
            {/* Gallery Section */}
            <div className="bg-white py-12 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[400px] md:h-[600px]">
                        {/* Main Image */}
                        <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={store.images[0] || "/placeholder.jpg"}
                                alt={store.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Middle Column */}
                        <div className="md:col-span-4 flex flex-col gap-6">
                            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm">
                                <Image
                                    src={store.images[1] || store.images[0] || "/placeholder.jpg"}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm">
                                <Image
                                    src={store.images[2] || store.images[0] || "/placeholder.jpg"}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        {/* Right Image */}
                        <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={store.images[3] || store.images[0] || "/placeholder.jpg"}
                                alt={store.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-16 scale-95">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Content */}
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-8">{store.name}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-12">
                            {store.short_description || "The Like telecom Tech store stands out as the premier destination for the latest gadgets and electronics in one of Bangladesh's most iconic shopping hubs."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#ED6B33] flex items-center justify-center mb-6">
                                    <FaMapMarkerAlt className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 uppercase tracking-tight">Shop address</h3>
                                <p className="text-gray-500 text-sm leading-snug">{store.address}</p>
                            </div>

                            {/* Hours */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#ED6B33] flex items-center justify-center mb-6">
                                    <FaClock className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 uppercase tracking-tight">Opening Hours & Close</h3>
                                <p className="text-gray-500 text-sm leading-snug">
                                    {store.opening_hours} <span className="text-[#ED6B33] font-bold">( {store.closed_day} off )</span>
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#ED6B33] flex items-center justify-center mb-6">
                                    <FaPhoneAlt className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 uppercase tracking-tight">Outlet Phone</h3>
                                <p className="text-gray-500 text-sm">{store.phone}</p>
                            </div>

                            {/* Email */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#ED6B33] flex items-center justify-center mb-6">
                                    <FaEnvelope className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 uppercase tracking-tight">E-Mail Address</h3>
                                <p className="text-gray-500 text-sm">liketelecom@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl h-full min-h-[400px] border-4 border-white">
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{
                                    __html: store.embedded_map_link
                                        .replace(/width="600"/, 'width="100%"')
                                        .replace(/height="450"/, 'height="100%"')
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailsPage;
