"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineDuplicate } from "react-icons/hi";

interface ReferralData {
    user_id: number;
    referral_code: string;
    referral_link: string;
}

export default function ReferralPage() {
    const { accessToken } = useAuth();
    const [data, setData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferralLink = async () => {
            if (!accessToken) return;
            try {
                const res = await fetch("/api/auth/referral-link", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const result = await res.json();
                if (result.result) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching referral link:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReferralLink();
    }, [accessToken]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-40 bg-gray-100 rounded mb-4"></div>
            </div>
        );
    }

    const frontendReferralLink = data?.referral_code
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/registration?referral_code=${data.referral_code}`
        : "N/A";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-medium text-gray-800 mb-6">Referral System</h1>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-8 text-center">
                <p className="text-orange-800 font-medium mb-2">Share your referral link with friends and earn rewards!</p>
                <p className="text-sm text-orange-600 italic">Referring a friend gives both of you club points upon signup.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-800">
                            {data?.referral_code || "N/A"}
                        </div>
                        <button
                            onClick={() => copyToClipboard(data?.referral_code || "")}
                            className="bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                            title="Copy Code"
                        >
                            <HiOutlineDuplicate size={24} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-600 truncate">
                            {frontendReferralLink}
                        </div>
                        <button
                            onClick={() => copyToClipboard(frontendReferralLink)}
                            className="bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                            title="Copy Link"
                        >
                            <HiOutlineDuplicate size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl mb-3">1</div>
                        <p className="text-sm text-gray-600 font-medium">Copy your link or code</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl mb-3">2</div>
                        <p className="text-sm text-gray-600 font-medium">Friends sign up using your link</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl mb-3">3</div>
                        <p className="text-sm text-gray-600 font-medium">Both earn rewards immediately!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
