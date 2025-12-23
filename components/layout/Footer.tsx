"use client";

import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface FooterData {
  footer_logo?: string;
  about_us_description?: string;
  frontend_copyright_text?: string;
  app_store_link?: string | null;
  play_store_link?: string | null;
  show_social_links?: string;
  facebook_link?: string;
  twitter_link?: string;
  instagram_link?: string;
  youtube_link?: string;
  widget_one?: string;
  widget_one_labels?: string;
  widget_one_links?: string;
  widget_two?: string;
  widget_two_labels?: string;
  widget_two_links?: string;
  helpline_number?: string;
  contact_address?: string;
  payment_method_images?: string;
  contact_email?: string;
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("/api/footer");
        const result = await response.json();
        if (result.success && result.data) {
          setFooterData(result.data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Parse JSON strings safely
  const parseJsonString = (str: string | undefined): string[] => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  // Parse HTML content safely
  const parseHtml = (html: string | undefined): string => {
    if (!html) return "";
    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

  if (loading) {
    return (
      <footer className="bg-black text-white pt-20 pb-6">
        <div className="w-10/12 mx-auto text-center py-10">
          <p className="text-gray-400">Loading...</p>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  const widgetOneLabels = parseJsonString(footerData.widget_one_labels);
  const widgetOneLinks = parseJsonString(footerData.widget_one_links);
  const widgetTwoLabels = parseJsonString(footerData.widget_two_labels);
  const widgetTwoLinks = parseJsonString(footerData.widget_two_links);
  const showSocialLinks = footerData.show_social_links === "on";

  return (
    <footer className="bg-black text-white pt-20 pb-6">
      {/* Outer Wrapper */}
      <div className="w-10/12 mx-auto border-b border-gray-700 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* LEFT SECTION (4/12) */}
          <div className="md:col-span-4">
            {/* Logo */}
            {footerData.footer_logo && (
              <div className="mb-4">
                <Image
                  src={footerData.footer_logo}
                  alt="Footer Logo"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            {/* About Description */}
            {footerData.about_us_description && (
              <p
                className="text-gray-400 text-sm leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html: footerData.about_us_description,
                }}
              />
            )}

            {/* Social Icons */}
            {showSocialLinks && (
              <div className="flex items-center gap-3 mb-4">
                {footerData.facebook_link && (
                  <a
                    href={footerData.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaFacebookF className="text-white text-sm" />
                  </a>
                )}
                {footerData.instagram_link && (
                  <a
                    href={footerData.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                )}
                {footerData.youtube_link && (
                  <a
                    href={footerData.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaYoutube className="text-white text-sm" />
                  </a>
                )}
                {footerData.twitter_link && (
                  <a
                    href={footerData.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaTwitter className="text-white text-sm" />
                  </a>
                )}
              </div>
            )}

            {/* Payment Method Image */}
            {footerData.payment_method_images && (
              <div className="flex flex-row items-center gap-2">
                <p className="text-sm font-medium mb-2">Pay With</p>
                <div className="relative h-12 w-48">
                  <Image
                    src={footerData.payment_method_images}
                    alt="Payment Methods"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION (8/12) */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* About Us - Static */}
            <div>
              <h3 className="text-md font-semibold mb-3">About Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/about-us" className="hover:text-white transition">
                    Regarding Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="hover:text-white transition">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            {/* Widget One */}
            {footerData.widget_one && widgetOneLabels.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-3">
                  {footerData.widget_one}
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {widgetOneLabels.map((label, index) => (
                    <li key={index}>
                      <Link
                        href={widgetOneLinks[index] || "#"}
                        className="hover:text-white transition"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Widget Two */}
            {footerData.widget_two && widgetTwoLabels.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-3">
                  {footerData.widget_two}
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {widgetTwoLabels.map((label, index) => (
                    <li key={index}>
                      <Link
                        href={widgetTwoLinks[index] || "#"}
                        className="hover:text-white transition"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Us */}
            <div>
              <h3 className="text-md font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm mb-4">
                {footerData.helpline_number && (
                  <li>
                    <a
                      href={`tel:${footerData.helpline_number}`}
                      className="hover:text-white transition"
                    >
                      {footerData.helpline_number}
                    </a>
                  </li>
                )}
                {footerData.contact_email && (
                  <li>
                    <a
                      href={`mailto:${footerData.contact_email}`}
                      className="hover:text-white transition"
                    >
                      {footerData.contact_email}
                    </a>
                  </li>
                )}
                {footerData.contact_address && (
                  <li className="text-xs leading-relaxed">
                    {footerData.contact_address}
                  </li>
                )}
              </ul>

              {/* Store Locator with Google Map */}
              <div className="rounded-md overflow-hidden w-full h-[150px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902087158993!2d90.42027327536774!3d23.750857288811812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b89832a89a67%3A0x9b4a955a8ed6f9b4!2sJamuna%20Future%20Park!5e0!3m2!1sen!2sbd!4v1699786046284!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      {footerData.frontend_copyright_text && (
        <div
          className="text-center text-gray-500 text-sm mt-6"
          dangerouslySetInnerHTML={{
            __html: footerData.frontend_copyright_text,
          }}
        />
      )}
    </footer>
  );
};

export default Footer;