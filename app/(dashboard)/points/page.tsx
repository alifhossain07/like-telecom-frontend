"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { formatPrice } from "@/app/lib/format-utils";
import { HiOutlineGift, HiOutlineClock, HiOutlineChevronRight } from "react-icons/hi";

interface PointLog {
    id: number;
    user_id: number;
    points: number;
    convertible_points: number;
    type: string;
    details: string;
    created_at: string;
}

interface PointsSummary {
    total_earned_points: number;
    total_spent_points: number;
    net_available_points: number;
    available_points: number;
    discount_per_point: number;
    max_savings_amount: number;
    convert_rate_points_per_currency: number;
    convertible_wallet_amount: number;
}

interface PointsResponse {
    summary: PointsSummary;
    data: {
        data: PointLog[];
    };
}

export default function PointsPage() {
    const { accessToken } = useAuth();
    const [logs, setLogs] = useState<PointLog[]>([]);
    const [summary, setSummary] = useState<PointsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoints = async () => {
            if (!accessToken) return;
            try {
                const res = await fetch("/api/clubpoint/get-list", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const result: PointsResponse = await res.json();
                setSummary(result.summary);
                setLogs(result.data.data);
            } catch (error) {
                console.error("Error fetching club points:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, [accessToken]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-100 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-1 sm:p-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="lg:text-3xl text-2xl font-medium text-gray-900">My Club Points</h1>
                    <p className="text-gray-500 mt-1">Earn points on every purchase and redeem them for exclusive discounts.</p>
                </div>
                <div className="bg-orange-500 text-white lg:px-5 lg:py-2.5 px-4 py-2 rounded-full font-medium shadow-lg shadow-orange-200 flex items-center gap-2 w-fit">
                    <HiOutlineGift size={20} />
                    <span>{summary?.available_points || 0} Total Points</span>
                </div>
            </div>

            {/* Points Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <p className="text-sm font-medium text-gray-5000 uppercase tracking-wider mb-2">Total Earned</p>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-medium text-gray-800">{summary?.total_earned_points || 0}</span>
                        <span className="text-gray-400 font-medium mb-1 ml-1 text-sm">pts</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-gray-5000 uppercase tracking-wider mb-2">Total Spent</p>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-medium text-gray-800">{summary?.total_spent_points || 0}</span>
                        <span className="text-gray-400 font-medium mb-1 ml-1 text-sm">pts</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-md shadow-xl shadow-orange-100 transform hover:scale-[1.02] transition-transform">
                    <p className="text-sm font-medium text-white uppercase tracking-wider mb-2">Available Points</p>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-medium text-white">{summary?.available_points || 0}</span>
                        <span className="text-orange-200 font-medium mb-1 ml-1 text-sm">pts</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-md shadow-xl shadow-green-100 transform hover:scale-[1.02] transition-transform">
                    <p className="text-sm font-medium text-white uppercase tracking-wider mb-2">Redeemable Value</p>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-medium text-white">
                            ৳ {formatPrice((summary?.available_points || 0) * (summary?.discount_per_point || 0))}
                        </span>
                    </div>
                </div>
            </div>

            {/* Simplified Points Activity */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                            <HiOutlineClock size={24} />
                        </div>
                        Recent Activity
                    </h2>
                </div>

                <div className="p-4 sm:p-8">
                    {logs.length > 0 ? (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border-l-4 border-l-transparent hover:border-l-orange-500 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${log.points >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                            }`}>
                                            {log.points >= 0 ? <HiOutlineGift size={24} /> : <HiOutlineClock size={24} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-lg">{log.points >= 0 ? "Points Received" : "Points Spent"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className={`text-2xl font-medium ${log.points >= 0 ? "text-green-600" : "text-red-600"
                                            }`}>
                                            {log.points >= 0 ? "+" : ""}{log.points}
                                        </div>
                                        <HiOutlineChevronRight className="text-gray-300 group-hover:text-orange-500 transition-colors hidden sm:block" size={24} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <HiOutlineGift size={48} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">No activity yet</h3>
                            <p className="text-gray-500 mt-2">Start shopping to earn your first club points!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
