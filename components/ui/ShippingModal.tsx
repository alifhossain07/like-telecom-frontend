'use client';

import { useEffect, useState } from 'react';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShippingData {
  id: number;
  title: string;
  slug: string;
  type: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  keywords: string;
  created_at: string;
  updated_at: string;
}

export default function ShippingModal({ isOpen, onClose }: ShippingModalProps) {
  const [loading, setLoading] = useState(true);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchShippingData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/pages/shipping');
        if (!res.ok) throw new Error('Failed to fetch shipping information');
        
        const json = await res.json();
        
        if (json.result && json.data) {
          setShippingData(json.data);
        } else {
          throw new Error(json.message || 'Failed to load shipping information');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchShippingData();
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-3 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6">
          {/* Loading Spinner */}
          {loading && (
            <div className="w-full flex justify-center py-8">
              <div className="h-8 w-8 sm:h-10 sm:w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="w-full py-8 text-center">
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Shipping Content */}
          {!loading && !error && shippingData && (
            <>
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8">
                {shippingData.title}
              </h2>

              {/* Content */}
              <div 
                className="dynamic-content-renderer text-gray-700"
                dangerouslySetInnerHTML={{ __html: shippingData.content }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

