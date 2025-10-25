import React from "react";
import Image from "next/image";
import { FiHeadphones, FiPackage, FiTruck, FiShield, FiCheckCircle, FiAward } from "react-icons/fi";
const Hero = () => {
  return (
    <div className="w-10/12 mx-auto">
      <div className=" flex  gap-1 ">
        {/* Left Image */}
        <div className="flex-1 pt-5 px-2 ">
          <Image
            src="/images/iphone16.png" // replace with your image path
            alt="Left Hero"
            width={300} // adjust width
            height={400} // adjust height
            className="w-full h-full  rounded-lg object-cover"
          />
        </div>

        {/* Middle Image */}
        <div className="flex-[2] pt-5 px-2 ">
          <Image
            src="/images/iphone15.png"
            alt="Middle Hero"
            width={600} // larger because middle is wider
            height={400}
            className="w-full  rounded-lg object-cover"
          />
        </div>

        {/* Right Image */}
        <div className="flex-1 pt-5 px-2 ">
          <Image
            src="/images/iphone161.png"
            alt="Right Hero"
            width={300}
            height={400}
            className="w-full h-full  rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Feature Support */}

      <div className="grid grid-cols-6 gap-6 py-8 text-center">
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiHeadphones className="text-5xl mb-2" />
          <span className="text-lg font-semibold">Online Support</span>
        </div>
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiPackage className="text-5xl mb-2" />
          <span className="text-lg font-semibold">Official Product</span>
        </div>
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiTruck className="text-5xl mb-2" />
          <span className="text-lg font-semibold">Fastest Delivery</span>
        </div>
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiShield className="text-5xl mb-2" />
          <span className="text-lg font-semibold">Secure Payment</span>
        </div>
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiCheckCircle className="text-5xl mb-2" />
          <span className="text-lg font-semibold">Genuine Product</span>
        </div>
        <div className="bg-gray-200 py-12 flex flex-col items-center justify-center rounded-lg">
          <FiAward className="text-5xl mb-2" />
          <span className="text-lg font-semibold">ISO Certified</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
