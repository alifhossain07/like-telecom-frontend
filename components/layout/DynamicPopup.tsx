"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface PopupData {
  id: number;
  status: number;
  title: string;
  summary: string;
  banner: string;
  btn_link: string;
  btn_text: string;
  btn_text_color: string;
  btn_background_color: string;
  show_subscribe_form: boolean;
  created_at: string;
  updated_at: string;
}

interface PopupResponse {
  data: PopupData[];
  success: boolean;
  status: number;
}

const DynamicPopup = () => {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if popup was already closed in this session
    const popupClosed = sessionStorage.getItem("dynamic-popup-closed");
    if (popupClosed === "true") {
      setIsLoading(false);
      return;
    }

    // Fetch popup data
    const fetchPopupData = async () => {
      try {
        const response = await fetch("/api/dynamic-popups");
        const result: PopupResponse = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // Get the first active popup (status === 1)
          const activePopup = result.data.find((popup) => popup.status === 1);
          if (activePopup) {
            setPopupData(activePopup);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error("Error fetching popup data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupData();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Store in sessionStorage so it doesn't show again during this session
    sessionStorage.setItem("dynamic-popup-closed", "true");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking on the backdrop (not on the image)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (isLoading || !isVisible || !popupData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-80 h-80 mb-32">
        <Image
          src={popupData.banner}
          alt={popupData.title || "Popup"}
          width={800}
          height={600}
          className="object-contain rounded-lg shadow-2xl"
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default DynamicPopup;

