"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

interface CareerPageData {
    top_heading: string;
    title: string;
    subtitle: string;
    images: string[];
}

interface CareerListing {
    id: number;
    job_title: string;
    vacancy: number;
    deadline: string;
    description: string;
    apply_link: string;
    status: number;
}

const CareerPage = () => {
    const [pageData, setPageData] = useState<CareerPageData | null>(null);
    const [careers, setCareers] = useState<CareerListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pageRes, careersRes] = await Promise.all([
                    axios.get("/api/pages/career-page"),
                    axios.get("/api/careers")
                ]);

                if (pageRes.data.result) {
                    setPageData(pageRes.data.data.content);
                }

                if (careersRes.data.success) {
                    setCareers(careersRes.data.data);
                }

            } catch (err) {
                console.error("Error fetching career data:", err);
                setError("Failed to load career information. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Something went wrong"}</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section className="py-12 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto bg-[#FFF3EE] rounded-[32px] p-8 md:p-8 flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-gray-400 text-sm font-medium text-gray-800 mb-6 bg-white/50">
                            {pageData.top_heading}
                        </div>
                        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {pageData.title}
                        </h1>
                        <p className="text-gray-600 text-md  leading-relaxed max-w-xl">
                            {pageData.subtitle}
                        </p>
                    </div>

                    {/* Right Content - Image Grid */}
                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                        {pageData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-[5/3]  rounded-2xl overflow-hidden shadow-md">
                                <Image
                                    src={img}
                                    alt={`Career Image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Listings Section */}
            <section className="py-16 px-4 md:px-8">
                <div className="max-w-[1440px] w-10/12 mx-auto">
                    <div className="space-y-8">
                        {careers.map((job) => (
                            <div key={job.id} className="border-b-2 border-gray-400 pb-12 last:border-0">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-4">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                            {job.job_title}
                                        </h2>
                                        <div className="space-y-2 text-gray-700">
                                            <p className="font-semibold">Vacancy : {job.vacancy.toString().padStart(2, '0')}</p>
                                            <p className="font-semibold">Deadline : {new Date(job.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="font-semibold">Job title : {job.description}</p>
                                        </div>
                                    </div>

                                    {job.status === 1 ? (
                                        <a
                                            href={job.apply_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#ED6B33] hover:bg-[#D45928] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-sm"
                                        >
                                            Apply Now <FaPaperPlane className="text-sm" />
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-[#EE2D24] text-white font-bold py-3 px-12 rounded-lg cursor-not-allowed shadow-sm"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareerPage;
