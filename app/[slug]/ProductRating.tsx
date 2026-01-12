"use client";

import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { MdStars } from "react-icons/md";
import Reviews from "@/app/productdetails/Reviews";

interface ProductRatingProps {
    product: {
        id: number;
        rating: number;
        rating_count: number;
    };
}

const ProductRating = ({ product }: ProductRatingProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { rating, rating_count: ratingCount } = product;

    return (
        <>
            {/* Clickable Rating Section */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="flex items-center p-6 mb-1 bg-[#f4f4f4] gap-2 cursor-pointer hover:bg-gray-200 transition"
            >
                <div className="flex items-center font-medium text-sm text-gray-700 mr-3">
                    <MdStars className="w-5 h-5 text-black mr-2" />
                    Rating:
                </div>

                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                        if (rating >= star) {
                            return <FaStar key={star} className="w-5 h-5 text-orange-500" />;
                        }
                        if (rating >= star - 0.5) {
                            return <FaStarHalfAlt key={star} className="w-5 h-5 text-orange-500" />;
                        }
                        return <FaRegStar key={star} className="w-5 h-5 text-gray-300" />;
                    })}
                </div>

                <span className="text-sm text-gray-700">
                    ({typeof rating === 'number' ? rating.toFixed(1) : rating}) / {ratingCount > 0 ? `${ratingCount}+ Reviews` : "No reviews"}
                </span>
            </div>

            {/* Reviews Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Product Reviews</h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(false);
                                }}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                            <Reviews
                                productId={product.id}
                                className="w-full" // Removed py-10 to fit better in modal
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductRating;
