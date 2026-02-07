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
  google_map_iframe?: string;
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

  // Transform footer page links to use /footer/{slug} format
  // Only transform relative links that don't start with /footer, /, #, or http
  const transformFooterLink = (link: string): string => {
    if (!link || link === "#" || link.startsWith("http") || link.startsWith("/footer/") || link === "/") {
      return link;
    }
    // Remove leading slash if present, then add /footer/ prefix
    const slug = link.startsWith("/") ? link.slice(1) : link;
    return `/footer/${slug}`;
  };

  return (
    <footer className="bg-[#F3F5F9] text-black md:pt-20 pt-10 pb-6">
      {/* Outer Wrapper */}
      <div className="w-10/12 mx-auto border-b border-gray-700 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* LEFT SECTION (4/12) */}
          <div className="md:col-span-4 text-center md:text-left">
            {/* Logo */}
            {footerData.footer_logo && (
              <div className="mb-4 flex justify-center md:justify-start">
                <Image
                  src={footerData.footer_logo}
                  alt="Footer Logo"
                  width={500}
                  height={500}
                  className="object-contain h-auto w-[140px]"
                />
              </div>
            )}

            {/* About Description */}
            {footerData.about_us_description && (
              <p
                className="text-gray-900 text-sm leading-relaxed mb-4 mx-auto md:mx-0"
                dangerouslySetInnerHTML={{
                  __html: footerData.about_us_description,
                }}
              />
            )}

            {/* Social Icons */}
            {showSocialLinks && (
              <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
                {footerData.facebook_link && (
                  <a
                    href={footerData.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaFacebookF className="text-white text-sm" />
                  </a>
                )}

                {footerData.instagram_link && (
                  <a
                    href={footerData.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                )}

                {footerData.youtube_link && (
                  <a
                    href={footerData.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaYoutube className="text-white text-sm" />
                  </a>
                )}

                {footerData.twitter_link && (
                  <a
                    href={footerData.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaTwitter className="text-white text-sm" />
                  </a>
                )}
              </div>
            )}

            {/* Trade License */}
            <div className="flex justify-center md:justify-start">
              <p className="text-sm font-medium">
                Trade License No: TRAD/DNC/053383/2022
              </p>
            </div>
          </div>

          {/* RIGHT SECTION (8/12) */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Us - Static */}
            <div className="text-center md:text-left">
              <h3 className="text-md font-semibold mb-3">About Us</h3>
              <ul className="space-y-2 text-gray-900 text-sm mx-auto md:mx-0 w-fit">
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
              <div className="text-center md:text-left">
                <h3 className="text-md font-semibold mb-3">
                  {footerData.widget_one}
                </h3>
                <ul className="space-y-2 text-gray-900 text-sm mx-auto md:mx-0 w-fit">
                  {widgetOneLabels.map((label, index) => (
                    <li key={index}>
                      <Link
                        href={transformFooterLink(widgetOneLinks[index] || "#")}
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
              <div className="text-center md:text-left">
                <h3 className="text-md font-semibold mb-3">
                  {footerData.widget_two}
                </h3>
                <ul className="space-y-2 text-gray-900 text-sm mx-auto md:mx-0 w-fit">
                  {widgetTwoLabels.map((label, index) => (
                    <li key={index}>
                      <Link
                        href={transformFooterLink(widgetTwoLinks[index] || "#")}
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
            <div className="text-center md:text-left">
              <h3 className="text-md font-semibold mb-3">Contact Us</h3>

              <ul className="space-y-2 text-gray-900 text-sm mb-4 mx-auto md:mx-0 w-fit">
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

              {/* Google Map */}
              {footerData.google_map_iframe && (
                <div className="rounded-md overflow-hidden w-full h-[150px] mx-auto md:mx-0">
                  <iframe
                    src={footerData.google_map_iframe}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
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

      {/* Payment Banner */}
      <div className="flex justify-center mt-4 pb-10">
        <Image
          src="/images/payment_banner.png"
          alt="Payment Methods"
          width={800}
          height={100}
          className="h-auto w-auto object-contain"
        />
      </div>
    </footer>
  );
};

export default Footer;