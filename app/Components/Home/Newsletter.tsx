import React from "react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";

const NewsletterBanner: React.FC = () => {
  return (
    <div className="w-10/12 pb-10  mx-auto mt-12">
      <div className="bg-gradient-to-r  from-orange-400 to-orange-600 rounded-xl flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 text-white relative overflow-hidden">
        {/* Left Side */}
        <div className="flex flex-col items-start gap-5 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
            Subscribe to our newsletter for updates
          </h2>

          {/* Input + Button (separate elements) */}
          <div className="flex items-center gap-3">
            {/* Email Input */}
            <div className="flex items-center bg-transparent border border-white/60 rounded-full px-4 py-2">
              <FiMail className="text-white/80 mr-2 text-lg" />
              <input
                type="text"
                placeholder="Email address"
                readOnly
                className="bg-transparent outline-none placeholder-white/70 text-white text-sm w-48 sm:w-64"
              />
            </div>

            {/* Submit Button */}
            <button className="bg-white text-orange-600 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition">
              Submit
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="mt-8 md:mt-0 md:absolute md:right-40 md:bottom-0">
          <Image
            src="/images/newsletterImg.png" // replace with your actual path
            alt="Newsletter person"
            width={260}
            height={260}
            className="object-fill"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
