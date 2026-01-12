"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { ReviewHistoryItem, PendingReviewProduct } from "@/types/review";

export default function ReviewPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("to-be-reviewed");
  const [pendingProducts, setPendingProducts] = useState<PendingReviewProduct[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PendingReviewProduct | null>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch pending reviews
  const fetchPendingReviews = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews/pending", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log("Pending reviews API response:", data);

      if (data.result || data.success) {
        console.log("Pending products data:", data.data);
        setPendingProducts(data.data || []);
      } else {
        console.error("API returned unsuccessful response:", data);
      }
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Fetch review history
  const fetchReviewHistory = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews/history", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.result || data.success) {
        setReviewHistory(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching review history:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (activeTab === "to-be-reviewed") {
      fetchPendingReviews();
    } else {
      fetchReviewHistory();
    }
  }, [activeTab, fetchPendingReviews, fetchReviewHistory]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!selectedProduct || !accessToken) return;
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      // Convert images to base64
      const imagePromises = selectedImages.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          image: base64,
          filename: file.name,
        };
      });

      const images = await Promise.all(imagePromises);

      // Extract and validate product ID
      // Prioritize product_id if available (as pending items might be order items with their own ID)
      const rawId = selectedProduct.product_id || selectedProduct.id;
      if (!rawId) {
        alert("Error: Product ID is missing. Please refresh and try again.");
        console.error("Missing product ID:", selectedProduct);
        setSubmitting(false);
        return;
      }

      const productId = parseInt(String(rawId), 10);
      if (isNaN(productId)) {
        alert("Error: Invalid Product ID format.");
        console.error("Invalid product ID format:", rawId);
        setSubmitting(false);
        return;
      }

      const payload = {
        product_id: productId,
        rating,
        comment,
        images,
      };

      console.log("Submitting review payload:", payload);

      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.result || data.success) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        resetReviewForm();
        fetchPendingReviews(); // Refresh the list
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset review form
  const resetReviewForm = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setSelectedImages([]);
    setImagePreviews([]);
    setSelectedProduct(null);
  };

  // Open review modal
  const openReviewModal = (product: PendingReviewProduct) => {
    console.log("openReviewModal called with:", product);
    // Reset form fields but keep product
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setSelectedImages([]);
    setImagePreviews([]);
    // Set product and show modal
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("to-be-reviewed")}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${activeTab === "to-be-reviewed"
            ? "bg-[#E9672B] text-white"
            : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
            }`}
        >
          To Be Reviewed
        </button>
        <button
          onClick={() => setActiveTab("review-history")}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${activeTab === "review-history"
            ? "bg-[#E9672B] text-white"
            : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
            }`}
        >
          Review History
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-[#F3F4F6] rounded-xl py-12 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-gray-900">Loading...</h2>
        </div>
      ) : activeTab === "to-be-reviewed" ? (
        pendingProducts.length === 0 ? (
          <div className="bg-[#F3F4F6] rounded-xl py-12 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-semibold text-gray-900">No Record found!</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingProducts.map((product, index) => {
              console.log(`Product ${index}:`, product);
              return (
                <div
                  key={product.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={product.product_thumbnail || product.thumbnail_image || product.image || "/images/placeholder.png"}
                      alt={product.name || "Product"}
                      fill
                      className="object-contain"
                      onError={() => {
                        console.error("Image load error for product:", product);
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name || product.product_name || "Unknown Product"}
                  </h3>
                  <button
                    onClick={() => {
                      console.log("Opening modal for product:", product);
                      openReviewModal(product);
                    }}
                    className="w-full bg-[#E9672B] text-white py-2 rounded-lg font-semibold hover:bg-[#d55a1f] transition"
                  >
                    Write Review
                  </button>
                </div>
              );
            })}
          </div>
        )
      ) : reviewHistory.length === 0 ? (
        <div className="bg-[#F3F4F6] rounded-xl py-12 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-gray-900">No Record found!</h2>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewHistory.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 relative flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={review.product_thumbnail || "/images/placeholder.png"}
                    alt={review.product_name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {review.product_name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? "text-orange-500" : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {review.photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 relative rounded-md overflow-hidden"
                        >
                          <Image
                            src={photo}
                            alt={`Review image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Write Review</h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  resetReviewForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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

            {/* Product Info */}
            <div className="flex gap-3 mb-4 pb-4 border-b">
              <div className="w-16 h-16 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={selectedProduct.product_thumbnail || selectedProduct.thumbnail_image || selectedProduct.thumbnail || selectedProduct.image || "/images/placeholder.png"}
                  alt={selectedProduct.name || "Product"}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                    className="text-3xl transition-colors"
                  >
                    <span
                      className={
                        i < (hoveredRating || rating)
                          ? "text-orange-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Comment *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Share your experience with this product..."
              />
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Images (Optional, max 5)
              </label>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <Image
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedImages.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <span className="text-3xl text-gray-400">+</span>
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="w-full bg-[#E9672B] text-white py-3 rounded-lg font-semibold hover:bg-[#d55a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}