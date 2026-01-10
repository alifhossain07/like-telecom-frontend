"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaPhoneAlt, FaMapMarkerAlt, FaTools, FaCheckCircle, FaChevronRight } from "react-icons/fa";

// export const dynamic = 'force-dynamic';

interface Device {
    image: string;
    name: string;
    link: string;
}

interface Repair {
    image: string;
    title: string;
    description: string;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface ChooseItem {
    number: string;
    title: string;
    description: string;
}

interface ServicePageData {
    hero_badge: string;
    hero_title: string;
    hero_subtitle: string;
    hero_button_text: string;
    hero_button_link: string;
    hero_map_embed: string;
    intro_title: string;
    intro_subtitle: string;
    intro_description: string;
    devices: Device[];
    about_title: string;
    about_highlight: string;
    about_description: string;
    about_secondary_text: string;
    about_bottom_title: string;
    about_bottom_description: string;
    about_image: string;
    repair_section_title: string;
    repair_section_subtitle: string;
    repairs: Repair[];
    features_section_title: string;
    features_section_subtitle: string;
    features: Feature[];
    choose_section_title: string;
    choose_section_subtitle: string;
    choose_items: ChooseItem[];
}

const ServiceCenterPage = () => {
    const [pageData, setPageData] = useState<ServicePageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/pages/service-page");
                if (response.data.result) {
                    setPageData(response.data.data.content);
                } else {
                    setError("Failed to load service page data.");
                }
            } catch (err) {
                console.error("Error fetching service page data:", err);
                setError("Failed to load service page information. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E8A44]"></div>
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
                        className="bg-[#1E8A44] text-white px-6 py-2 rounded-md hover:bg-[#166933] transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Helper to highlight orange text in strings
    const renderHighlightedTitle = (title: string, highlight: string) => {
        if (!highlight) return title;
        const parts = title.split(highlight);
        return (
            <>
                {parts[0]}
                <span className="text-[#ED6B33]">{highlight}</span>
                {parts[1]}
            </>
        );
    };

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="bg-[#1E7D3C] text-white py-16 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto text-center">
                    <div className="inline-block px-4 py-1 rounded-full border border-white/40 text-lg md:text-sm font-semibold mb-8 bg-white/5">
                        {pageData.hero_badge}
                    </div>
                    <h1 className=" md:text-3xl  font-bold mb-8 leading-tight max-w-5xl mx-auto">
                        {pageData.hero_title}
                    </h1>

                    <a
                        href={pageData.hero_button_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-[#1E7D3C] hover:bg-gray-100 font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-xl text-md mb-16"
                    >
                        <div className="bg-[#1E7D3C] p-2 rounded-full">
                            <FaPhoneAlt size={16} className="text-white" />
                        </div>
                        {pageData.hero_button_text}
                    </a>

                    {/* Map Container */}
                    <div className="bg-white  shadow-2xl relative overflow-hidden max-w-6xl mx-auto border-4 border-white/20">
                        <div
                            className="w-full h-[350px] md:h-[500px]  overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: pageData.hero_map_embed.replace(/width="600"/, 'width="100%"').replace(/height="450"/, 'height="100%"') }}
                        />
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-24 bg-gray-100 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-12 max-w-4xl mx-auto leading-tight">
                        {pageData.intro_title}
                    </h2>
                    <div className="max-w-5xl mx-auto space-y-6">
                        <p className="text-gray-700 text-lg opacity-90 leading-relaxed font-medium">
                            {pageData.intro_description.split("\r\n\r\n")[0]}
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {pageData.intro_description.split("\r\n\r\n")[1]}
                        </p>
                    </div>
                </div>
            </section>

            {/* What We Fix Section */}
            <section className="py-24 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">{pageData.about_bottom_title}</h2>
                        <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
                            {pageData.about_bottom_description}
                        </p>
                    </div>

                    {/* Devices Grid - More premium like the image */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-7 gap-6 justify-center">
                        {pageData.devices.map((device, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer">
                                <div className="relative w-full aspect-square mb-6">
                                    <Image
                                        src={device.image}
                                        alt={device.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-sm font-extrabold text-[#1a1a1a] tracking-tight">{device.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Expertise Section */}
            <section className="py-24 bg-gray-200 px-4 md:px-8 ">
                <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="lg:w-1/2 space-y-10">
                        <div>
                            <h2 className="text-3xl  font-bold text-[#1a1a1a] leading-tight mb-8">
                                {pageData.about_title}
                            </h2>
                            <div className="space-y-6">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {pageData.about_description}
                                </p>
                                {/* <div className="p-8 border-l-[6px] border-[#ED6B33] bg-white shadow-sm rounded-r-2xl">
                                    <p className="text-gray-800 font-bold text-xl italic leading-relaxed">
                                        "{pageData.about_secondary_text}"
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <div className="relative aspect-[16/11] rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                            <Image
                                src={pageData.about_image}
                                alt="Expert Repair"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Repairs Section */}
            <section className="py-24 px-4 md:px-8">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                            {renderHighlightedTitle(pageData.repair_section_title, "Quick, Easy, and Reliable Repairs")}
                        </h2>
                        <p className="text-gray-500 text-xl max-w-3xl mx-auto font-medium">
                            {pageData.repair_section_subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {pageData.repairs.map((repair, idx) => (
                            <div key={idx} className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 group border border-gray-100/50">
                                <div className="relative h-72 overflow-hidden">
                                    <Image
                                        src={repair.image}
                                        alt={repair.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-1 bg-[#ED6B33] rounded-full" />
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{repair.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                        {repair.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24  px-4 md:px-8 bg-gray-200">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                            Our Best <span className="text-[#ED6B33]">Features For Better</span> Experience
                        </h2>
                        <p className="text-gray-500 text-xl max-w-4xl mx-auto font-medium">
                            {pageData.features_section_subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {pageData.features.map((feature, idx) => (
                            <div key={idx} className="p-12 rounded-[10px] bg-white border border-gray-100/50 shadow-sm hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center group">
                                <div className="w-24 h-24 relative mb-10 p-4 bg-gray-50 rounded-3xl group-hover:bg-[#ED6B33]/5 transition-colors duration-500">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-black text-[#1a1a1a] mb-6 uppercase tracking-widest">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 px-4 md:px-8 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl  font-black text-[#1a1a1a] mb-2">
                            Why <span className="text-[#ED6B33]">Choose Us</span>?
                        </h2>
                        <p className="text-gray-500 text-xl max-w-3xl mx-auto font-medium">
                            {pageData.choose_section_subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {pageData.choose_items.map((item, idx) => (
                            <div key={idx} className="bg-[#0A8544] p-12 rounded-[10px] text-white flex flex-col items-start group hover:bg-[#166933] transition-all duration-500 shadow-2xl shadow-green-900/10">
                                <div className="w-16 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center text-2xl font-black mb-10 bg-white/5 group-hover:bg-white group-hover:text-[#1E7D3C] transition-all duration-500">
                                    {item.number}
                                </div>
                                <h3 className="text-2xl font-black mb-8 tracking-tight">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-md font-medium">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceCenterPage;

