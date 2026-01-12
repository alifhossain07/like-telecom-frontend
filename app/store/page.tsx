"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaClock, FaTimesCircle, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

interface PickupPoint {
    id: number;
    name: string;
    address: string;
    phone: string;
    opening_hours: string;
    closed_day: string;
    embedded_map_link: string;
    images: string[];
}

const StoreLocationsPage = () => {
    const [stores, setStores] = useState<PickupPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get("/api/pickup-list");
                if (response.data && Array.isArray(response.data.data)) {
                    setStores(response.data.data);
                } else {
                    setError("Failed to load store locations.");
                }
            } catch (err) {
                console.error("Error fetching stores:", err);
                setError("Something went wrong while fetching store locations.");
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E8A44]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
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
        <div className="bg-[#F8F9FB] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">Our Store Locations</h1>
                    <p className="text-gray-500 text-lg">Discover the nearest Like Telecom branch for quick and reliable service.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                            <h2 className="text-xl font-bold text-[#1a1a1a] mb-8 leading-tight">{store.name}</h2>

                            <div className="space-y-5 mb-10 flex-grow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <FaClock className="text-gray-900 text-lg" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-gray-900 text-sm mb-0.5 font-medium leading-none">Open : {store.opening_hours.split(',')[0]}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <FaTimesCircle className="text-gray-900 text-lg" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-gray-900 text-sm mb-0.5 font-medium leading-none">Closed : {store.closed_day || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkerAlt className="text-gray-900 text-lg" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-gray-900 text-sm mb-0.5 font-medium leading-normal">Shop : {store.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <FaPhoneAlt className="text-gray-900 text-lg" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-gray-900 text-sm mb-0.5 font-medium leading-none">{store.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button
                                    onClick={() => {
                                        // Simple modal or jump to details and scroll to map? 
                                        // Based on image there is a Map button.
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, '_blank');
                                    }}
                                    className="flex-1 bg-gray-50 text-gray-500 font-semibold py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm"
                                >
                                    Map
                                </button>
                                <Link
                                    href={`/store/${store.id}`}
                                    className="flex-1 bg-[#ED6B33] text-white font-semibold py-3.5 rounded-full hover:bg-[#d95d2c] transition-colors text-center text-sm"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreLocationsPage;
