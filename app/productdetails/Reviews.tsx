"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ProductReviewsResponse } from "@/types/review";

interface ReviewsProps {
  productId: number;
  className?: string; // Allow custom styling
}

const Reviews = ({ productId, className }: ReviewsProps) => {
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch reviews
  // Fetch reviews
  const fetchReviews = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/product/${productId}?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setReviewsData(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews(currentPage);
    }
  }, [productId, currentPage, fetchReviews]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to reviews section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="w-full py-10">
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </section>
    );
  }

  const reviews = reviewsData?.data || [];
  const totalReviews = reviewsData?.meta?.total || 0;

  return (
    <section className={className || "w-full py-10"}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
            Reviews ({totalReviews < 10 ? "0" : ""}{totalReviews})
          </h2>
          <p className="text-gray-600 text-sm mt-1 w-10/12 md:w-full">
            Get specific details about this product from customers who own it.
          </p>
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-xl py-12 flex flex-col items-center justify-center text-center">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-gray-300 bg-gray-50 rounded-md">
            {reviews.map((review, idx) => (
              <div key={idx} className="p-6">
                {/* Reviewer Info */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden bg-white">
                    {review.avatar && review.avatar !== "http://like.test/public/assets/img/placeholder.jpg" ? (
                      <Image
                        src={review.avatar}
                        alt={review.user_name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                        />
                      </svg>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-900 font-medium">{review.user_name}</p>
                    <p className="text-gray-500 text-sm">{review.time}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex text-orange-500 text-lg mb-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                {/* Review Text */}
                <p className="text-gray-800 md:text-base text-sm mb-3">{review.comment}</p>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    {review.images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setPreview(img.path)}
                        className="cursor-pointer hover:opacity-90 transition"
                      >
                        <Image
                          src={img.path}
                          alt="review image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover border"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {reviewsData && reviewsData.meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: reviewsData.meta.last_page }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === reviewsData.meta.last_page ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${page === currentPage
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === reviewsData.meta.last_page}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setPreview(null)}
        >
          <Image
            src={preview}
            alt="Preview"
            width={700}
            height={700}
            className="rounded-lg shadow-xl object-contain max-h-[90vh]"
          />
        </div>
      )}
    </section>
  );
};

export default Reviews;
