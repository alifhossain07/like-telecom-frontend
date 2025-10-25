import Image from "next/image";
import React from "react";

const DisplayPhones = () => {
  const phones = [
    "Mobile Name",
    "Mobile Name",
    "Mobile Name",
    "Mobile Name",
    "Mobile Name",
    "Mobile Name",
    "Mobile Name",
  ];

  return (
    <div className="pb-16">
      <div className="w-10/12 mx-auto">
        {/* Responsive grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-12 md:gap-6 justify-items-center">
          {phones.map((phone, index) => (
            <div
              key={index}
              className="w-44 sm:w-48 md:w-52 lg:w-56 rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105"
            >
              <div className="w-full h-48 sm:h-52 flex justify-center items-center bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src="/images/iphoneImage.png"
                  alt={phone}
                  width={250}
                  height={250}
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center bg-gray-100 rounded-xl px-6 py-2 text-sm sm:text-base font-semibold text-gray-800">
                {phone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayPhones;
