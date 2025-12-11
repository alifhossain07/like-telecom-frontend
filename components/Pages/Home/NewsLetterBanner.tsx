import React from "react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";

const NewsletterBanner: React.FC = () => {
  return (
    <div className="w-11/12  pb-10 mx-auto mt-12">
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 text-white relative overflow-hidden">
        
        {/* Left Side */}
        <div className="flex flex-col items-start gap-5 max-w-lg text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
            Subscribe to our newsletter for updates
          </h2>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Email Input */}
            <div className="flex items-center bg-transparent border border-white/60 rounded-full px-4 py-2 w-full sm:w-auto">
              <FiMail className="text-white/80 mr-2 text-lg" />
              <input
                type="text"
                placeholder="Email address"
                className="bg-transparent outline-none placeholder-white/70 text-white text-sm w-full sm:w-64"
              />
            </div>

            {/* Submit Button */}
            <button className="bg-white text-orange-600 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition w-full sm:w-auto">
              Submit
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="mt-10 md:mt-0 md:absolute md:right-28 md:bottom-0 flex justify-center md:block">
          <Image
            src="/images/newsletterImg.png"
            alt="Newsletter person"
            width={240}
            height={240}
            className="object-contain w-44 sm:w-56 md:w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;