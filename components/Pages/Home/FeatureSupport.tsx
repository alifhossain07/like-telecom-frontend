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
    <div className="w-11/12 mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 pb-7 text-center justify-items-center md:justify-items-stretch">

        {/* ITEM */}
        <div className="bg-orange-100 w-[88px] aspect-square 
                        md:w-full md:aspect-[5/4] 
                        rounded-lg 
                        flex flex-col items-center justify-center">
          <FiHeadphones className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            Online Support
          </span>
        </div>

        <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4]  md:rounded-lg flex flex-col items-center justify-center">
          <FiPackage className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            Official Product
          </span>
        </div>

        <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4]  md:rounded-lg flex flex-col items-center justify-center">
          <FiTruck className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            Fast Delivery
          </span>
        </div>

        <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4]  md:rounded-lg flex flex-col items-center justify-center">
          <FiShield className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            Secure Payment
          </span>
        </div>

        <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4]  md:rounded-lg flex flex-col items-center justify-center">
          <FiCheckCircle className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            Genuine Product
          </span>
        </div>

        <div className="bg-orange-100 w-[88px] aspect-square md:w-full md:aspect-[5/4]  md:rounded-lg flex flex-col items-center justify-center">
          <FiAward className="text-xl md:text-[clamp(24px,2.5vw,44px)] mb-1 md:mb-2" />
          <span className="text-[12px] md:text-[clamp(12px,1vw,18px)]  leading-tight">
            ISO Certified
          </span>
        </div>

      </div>
    </div>
  );
};

export default FeatureSupport;
