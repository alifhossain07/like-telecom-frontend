import React from "react";

import {
  FiHeadphones,
  FiPackage,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";

const FeatureSupport = () => {
  return (
    <div className=" w-11/12 mx-auto">
      {/* Feature Support */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 pb-7 text-center">
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiHeadphones className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            Online Support
          </span>
        </div>
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiPackage className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            Official Product
          </span>
        </div>
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiTruck className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            Fastest Delivery
          </span>
        </div>
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiShield className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            Secure Payment
          </span>
        </div>
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiCheckCircle className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            Genuine Product
          </span>
        </div>
        <div className="bg-gray-200 py-8 md:py-12 flex flex-col items-center justify-center rounded-lg">
          <FiAward className="text-4xl md:text-5xl mb-2" />
          <span className="text-sm md:text-lg font-semibold">
            ISO Certified
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeatureSupport;