"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Announcement {
    id: number;
    title: string;
    description: string;
    expiry_date: string;
    status: number;
    created_at: string;
    updated_at: string;
}

const AnnouncementPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get("/api/announcements");
                if (response.data.success) {
                    setAnnouncements(response.data.data);
                } else {
                    setError("Failed to fetch announcements");
                }
            } catch (err) {
                console.error("Error fetching announcements:", err);
                setError("An error occurred while fetching announcements");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
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
                <div className="text-center">
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
        <div className="bg-white min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[#0A8544] text-white px-12 py-3 rounded-full text-xl md:text-2xl font-bold shadow-lg">
                        Big Announcement !
                    </div>
                </div>

                {/* Announcements List */}
                <div className="flex flex-col items-center gap-10">
                    {announcements.map((item) => (
                        <div
                            key={item.id}
                            className="w-full max-w-4xl bg-[#0A8544] rounded-[30px] p-6 md:p-8 shadow-xl"
                        >
                            {/* Card Header */}
                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-2.5 h-2.5 rounded-full bg-white mt-2.5 shrink-0" />
                                <div>
                                    <h2 className="text-white text-xl md:text-2xl font-bold leading-tight">
                                        {item.title}
                                    </h2>
                                    <p className="text-white/80 text-xs mt-1">
                                        {item.created_at}
                                    </p>
                                </div>
                            </div>

                            {/* Card Description */}
                            <div className="bg-white rounded-[25px] p-6 md:p-10">
                                <p className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}

                    {announcements.length === 0 && !loading && (
                        <div className="text-gray-500 text-center py-20">
                            No announcements available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPage;
