"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaWhatsapp,
    FaChevronDown,
} from "react-icons/fa";
import axios from "axios";
import CorporatePageSkeleton from "@/components/Skeletons/CorporatePageSkeleton";

interface CorporateData {
    header_title: string;
    header_subtitle: string;
    office_label: string;
    office_address: string;
    support_number_label: string;
    support_numbers: string;
    support_email_label: string;
    support_email: string;
    support_chat_label: string;
    support_chat_text: string;
    form_title: string;
    form_subtitle: string;
    form_button_text: string;
    clients_title: string;
    clients_subtitle: string;
    client_logos: string[];
    stats_title: string;
    stats_subtitle: string;
    statistics: {
        number: string;
        label: string;
    }[];
    team_title: string;
    team_subtitle: string;
    team_members: {
        photo: string;
        name: string;
        designation: string;
    }[];
    content_section_title: string;
    content_section_subtitle: string;
    content_section_image_1: string;
    content_section_image_2: string;
    features: {
        number: string;
        title: string;
        description: string;
    }[];
    faq_title: string;
    faq_subtitle: string;
    faqs: {
        question: string;
        answer: string;
    }[];
}

const CorporatePage = () => {
    const [data, setData] = useState<CorporateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/corporate");
                if (response.data.result) {
                    setData(response.data.data.content);
                } else {
                    setError(response.data.message || "Failed to load data");
                }
            } catch (err) {
                console.error("Error fetching corporate data:", err);
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CorporatePageSkeleton />;
    }

    if (error || !data) {
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
            <section className="bg-[#f9f9f9] py-10 px-4 md:px-8 ">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8 2xl:gap-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 bg-gray-200 p-6 2xl:p-8">
                        <h1 className="text-xl md:text-2xl 2xl:text-3xl font-bold leading-tight mb-4 whitespace-pre-line 2xl:mb-8">
                            {data.header_title}
                        </h1>
                        <p className="text-gray-600 mb-8 max-w-lg 2xl:max-w-2xl 2xl:text-lg 2xl:mb-12">
                            {data.header_subtitle}
                        </p>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
                            <div className="bg-white p-4 2xl:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-orange-50 rounded-full flex items-center justify-center mb-3 2xl:mb-4">
                                    <FaMapMarkerAlt className="text-[#FF6B00] text-lg 2xl:text-2xl" />
                                </div>
                                <h3 className="font-semibold text-orange-500 2xl:text-xl 2xl:mb-2">{data.office_label}</h3>
                                <p className="text-sm text-gray-500 2xl:text-lg">{data.office_address}</p>
                            </div>

                            <div className="bg-white p-4 2xl:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-orange-50 rounded-full flex items-center justify-center mb-3 2xl:mb-4">
                                    <FaPhoneAlt className="text-[#FF6B00] text-lg 2xl:text-2xl" />
                                </div>
                                <h3 className="font-semibold text-orange-500 2xl:text-xl 2xl:mb-2">{data.support_number_label}</h3>
                                {data.support_numbers.split(",").map((num, i) => (
                                    <p key={i} className="text-sm text-gray-500 2xl:text-base">{num.trim()}</p>
                                ))}
                            </div>

                            <div className="bg-white p-4 2xl:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-orange-50 rounded-full flex items-center justify-center mb-3 2xl:mb-4">
                                    <FaEnvelope className="text-[#FF6B00] text-lg 2xl:text-2xl" />
                                </div>
                                <h3 className="font-semibold text-orange-500 2xl:text-xl 2xl:mb-2">{data.support_email_label}</h3>
                                <p className="text-sm text-gray-500 2xl:text-base">{data.support_email}</p>
                            </div>

                            <div className="bg-white p-4 2xl:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-green-50 rounded-full flex items-center justify-center mb-3 2xl:mb-4">
                                    <FaWhatsapp className="text-[#00A859] text-xl 2xl:text-2xl" />
                                </div>
                                <h3 className="font-semibold text-orange-500 2xl:text-xl 2xl:mb-2">{data.support_chat_label}</h3>
                                <p className="text-sm text-gray-500 2xl:text-base">{data.support_chat_text}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="lg:w-1/2 bg-white p-6 2xl:p-10 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl 2xl:text-2xl font-bold mb-4 2xl:mb-6 text-orange-500 border-b border-orange-500 pb-1 inline-block">{data.form_title}</h2>
                        <p className="text-sm 2xl:text-base text-gray-500 mb-6 2xl:mb-8">{data.form_subtitle}</p>

                        <form className="space-y-4 2xl:space-y-6">
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1 font-bold">Name *</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 2xl:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1 font-bold">Phone Number *</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 2xl:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1 font-bold">Your Email *</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 2xl:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1 font-bold">Your Message *</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 2xl:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-[#FF6B00] text-white font-bold py-2 px-6 2xl:py-3 2xl:px-10 2xl:text-lg rounded flex items-center gap-2 hover:bg-[#e66000] transition duration-300 shadow-lg"
                                >
                                    {data.form_button_text.toUpperCase()}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Trusted Clients Section */}
            <section className="py-12 2xl:py-20 bg-white overflow-hidden">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 text-center">
                    <h2 className="text-2xl 2xl:text-3xl font-bold mb-3 2xl:mb-6 uppercase tracking-wider">{data.clients_title.split(" ").slice(0, -2).join(" ")} <span className="text-gray-800">{data.clients_title.split(" ").slice(-2).join(" ")}</span></h2>
                    <p className="text-gray-700 2xl:text-xl mb-8 2xl:mb-12 italic">{data.clients_subtitle}</p>

                    <div className="relative flex overflow-hidden group">
                        <div className="flex animate-marquee whitespace-nowrap gap-6 2xl:gap-10 items-center py-2">
                            {data.client_logos.concat(data.client_logos).map((logo, index) => (
                                <div key={index} className="flex-shrink-0 border p-2 2xl:p-4 rounded w-40 h-14 2xl:w-60 2xl:h-24 flex items-center justify-center shadow-sm border-gray-100 bg-white relative">
                                    <Image src={logo} alt={`Client ${index}`} fill className="object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Empowering Business Section */}
            <section className="bg-gray-100 py-8 2xl:py-12">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4 text-center">
                    <h2 className="text-2xl 2xl:text-3xl font-bold mb-2 2xl:mb-4">{data.stats_title}</h2>
                    <p className="text-gray-400 2xl:text-xl mb-10 2xl:mb-16 max-w-2xl 2xl:max-w-5xl mx-auto text-sm">{data.stats_subtitle}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 2xl:gap-6">
                        {data.statistics.map((stat, index) => (
                            <div key={index} className="bg-gradient-to-b from-gray-100 to-gray-300 p-6 2xl:p-10 rounded-lg shadow-sm border border-gray-200">
                                <h4 className="text-2xl 2xl:text-4xl font-bold text-gray-800 mb-1 2xl:mb-2">{stat.number}</h4>
                                <p className="text-gray-600 text-sm 2xl:text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporate Sales Experts Section */}
            <section className="py-12 2xl:py-20 bg-white">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4">
                    <div className="text-center mb-10 2xl:mb-20">
                        <h2 className="text-xl 2xl:text-3xl font-bold mb-2 2xl:mb-4 uppercase tracking-wide">{data.team_title}</h2>
                        <p className="text-gray-400 text-sm 2xl:text-xl max-w-3xl 2xl:max-w-6xl mx-auto">{data.team_subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-8">
                        {data.team_members.map((member, index) => (
                            <div key={index} className="group">
                                <div className="relative aspect-[4/5] rounded-none overflow-hidden mb-3 bg-gray-100 border border-gray-100 shadow-sm">
                                    <Image src={member.photo} alt={member.name} fill className="object-cover transition duration-500" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-bold text-sm 2xl:text-xl">{member.name}</h4>
                                    <p className="text-gray-400 text-xs 2xl:text-base">{member.designation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Share Your Requirements Section */}
            <section className="pb-10 bg-white">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-4">
                    <div className="text-center mb-10 2xl:mb-20 px-4">
                        <h2 className="text-2xl 2xl:text-3xl font-bold mb-3 2xl:mb-6 text-gray-800">{data.content_section_title}</h2>
                        <p className="text-gray-500 text-sm 2xl:text-xl max-w-3xl 2xl:max-w-6xl mx-auto leading-relaxed">{data.content_section_subtitle}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 2xl:gap-24 items-start">
                        {/* Images Column - Overlapping Layout */}
                        <div className="lg:w-5/12 relative h-[350px] md:h-[450px] 2xl:h-[600px] w-full mb-10 lg:mb-0">
                            {/* Background Image (Team) */}
                            <div className="absolute top-0 right-0 w-[85%] h-[70%] rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src={data.content_section_image_1}
                                    alt="Team"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Foreground Image (Product) */}
                            <div className="absolute bottom-0 left-0 w-[65%] h-[60%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-black">
                                <Image
                                    src={data.content_section_image_2}
                                    alt="Product"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* List Column - Stylized with Line */}
                        <div className="lg:w-7/12 relative pl-2 md:pl-4">
                            {/* Vertical line connecting boxes */}
                            <div className="absolute left-[24px] md:left-[31px] top-6 bottom-6 w-[1px] bg-gray-100 z-0 hidden sm:block"></div>

                            <div className="space-y-6 2xl:space-y-10 relative z-10">
                                {data.features.map((feature, i) => (
                                    <div key={i} className="flex gap-4 md:gap-6 2xl:gap-10 items-start">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 text-sm 2xl:text-xl shadow-sm border border-gray-50">
                                            {feature.number || (i + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="pt-1">
                                            <h4 className="font-bold text-lg 2xl:text-xl text-gray-900 mb-2 2xl:mb-4 leading-tight">{feature.title}</h4>
                                            <p className="text-gray-500 text-sm md:text-base 2xl:text-base leading-relaxed max-w-2xl 2xl:max-w-4xl">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 2xl:py-20 bg-[#f4f4f4]">
                <div className="w-11/12 max-w-[1440px] 2xl:max-w-[1800px] mx-auto bg-white py-8 2xl:py-16 px-6 2xl:px-12 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center mb-8 2xl:mb-16">
                        <h2 className="text-2xl 2xl:text-3xl font-bold mb-2 2xl:mb-4 uppercase tracking-wide">{data.faq_title}</h2>
                        <p className="text-gray-400 text-sm 2xl:text-lg italic">{data.faq_subtitle}</p>
                    </div>

                    <div className="space-y-2 2xl:space-y-4">
                        {data.faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="w-full px-5 py-3 2xl:py-5 flex items-center justify-between text-left font-bold bg-white text-gray-800 text-sm 2xl:text-lg"
                                >
                                    <span>{faq.question}</span>
                                    <FaChevronDown className={`text-gray-400 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaqIndex === index && (
                                    <div className="px-5 py-3 2xl:py-5 bg-white border-t border-gray-100">
                                        <p className="text-gray-500 text-xs 2xl:text-base leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CorporatePage;
