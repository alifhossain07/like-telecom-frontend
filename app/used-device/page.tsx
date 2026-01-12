"use client";

import { useEffect, useState } from "react";
import React from "react";

type PageData = {
    id: number;
    title: string;
    content: {
        iframe_link?: string;
        description?: string;
    };
    csvData?: {
        success: boolean;
        headers: string[];
        rows: string[][];
    };
};

export default function UsedDevicePage() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/used-device", { cache: "no-store" });
                const json = await res.json();

                if (json.result && json.data) {
                    // Merge csvData if it exists at root level of response
                    const pageData = json.data;
                    if (json.csvData) {
                        pageData.csvData = json.csvData;
                    }
                    setData(pageData);
                } else {
                    setError("Failed to load data");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-orange-500 font-semibold animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500">{error || "Page not found"}</p>
            </div>
        );
    }

    // Helper to extract SRC and clean it up (Fallback)
    const getCleanIframeSrc = (iframeString?: string) => {
        if (!iframeString) return null;
        const match = iframeString.match(/src="([^"]+)"/);
        if (match && match[1]) {
            let src = match[1];
            // Append optimizations if not present
            if (!src.includes("chrome=false")) src += "&chrome=false";
            if (!src.includes("widget=false")) src = src.replace("widget=true", "widget=false");
            return src;
        }
        return null;
    };

    const iframeSrc = getCleanIframeSrc(data.content.iframe_link);

    // Render Native Table if CSV Data is available
    if (data.csvData && data.csvData.success && data.csvData.headers) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header Section matching the design */}
                <div className="w-10/12 mx-auto mt-8 mb-0">
                    <div className="bg-black text-white py-4 text-center rounded-t-lg">
                        <h1 className="text-2xl font-medium tracking-wide">Used Device List</h1>
                    </div>
                </div>

                <div className="w-10/12 mx-auto bg-white shadow-sm border border-gray-200 border-t-0 rounded-b-lg overflow-hidden mb-10 overflow-x-auto">
                    <table className="w-full text-sm text-center border-collapse">
                        <thead>
                            <tr className="text-white">
                                {data.csvData.headers.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`py-3 px-4 font-semibold whitespace-nowrap ${idx === 0 ? 'bg-[#EB6420]' : 'bg-[#198754]'}`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.csvData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="py-3 px-4 text-gray-700 whitespace-nowrap font-medium">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Fallback to Iframe
    return (
        <div className="min-h-screen bg-white">
            {/* Header Section matching the design */}
            <div className="w-10/12 mx-auto mt-8 mb-0">
                <div className="bg-black text-white py-4 text-center rounded-t-lg">
                    <h1 className="text-2xl font-medium tracking-wide">Used Device List</h1>
                </div>
            </div>

            <div className="w-10/12 mx-auto bg-white shadow-sm border border-gray-200 border-t-0 rounded-b-lg overflow-hidden min-h-[600px] mb-10">
                {/* Render clean iframe if source is extracted */}
                {iframeSrc ? (
                    <iframe
                        src={iframeSrc}
                        className="w-full h-full min-h-[800px] border-none"
                        title={data.title}
                    />
                ) : (
                    // Fallback to simpler rendering if extraction fails
                    <div
                        className="p-8 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.content.iframe_link || data.content.description || "<p>No content available</p>" }}
                    />
                )}
            </div>
        </div>
    );
}
