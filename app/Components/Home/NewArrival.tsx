import React from 'react';
import { FiChevronRight } from "react-icons/fi";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import Image from "next/image";
const NewArrival = () => {
    return (
        <div className="w-10/12 mx-auto  pb-24">
              {/* Header */}
              <div className="flex justify-between items-center py-6 md:py-8 w-full">
                <div className=" w-7/12 ">
                  <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                  New Product Arrival
                  </h1>
                  <p className="text-xs sm:text-sm md:text-lg text-gray-600 max-w-md">
                    Explore brand-new products crafted for style, quality, and innovation.
                  </p>
                </div>
              
                <button className="bg-orange-500 text-xs sm:text-sm md:text-lg flex items-center gap-2 text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-orange-600 transition whitespace-nowrap">
                  See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
                </button>
              </div>
              
        
              {/* Flash Sale Grid */}
              <div className="flex items-stretch justify-between gap-6">
               
        
                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5  gap-6 flex-1">
                  {[1, 2, 3, 4,5].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-md transition relative flex flex-col justify-between"
                    >
                      {/* Discount & Wishlist */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-lg">
                          30%
                        </span>
                        <button className="text-red-400 bg-red-100 p-2 rounded-lg hover:text-red-500 transition">
                          <FaHeart size={14} />
                        </button>
                      </div>
        
                      {/* Product Image */}
                      <div className="flex justify-center items-center bg-gray-50 rounded-xl p-4">
                        <Image
                          src="/images/iphone1.png"
                          alt="iPhone"
                          width={300}
                          height={200}
                          className=""
                        />
                      </div>
        
                      {/* Product Info */}
                      <h3 className="mt-3 text-gray-800 font-semibold text-lg md:text-xl">
                        iPhone Series 16 Pro Max
                      </h3>
        
                      {/* Rating */}
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaStar className="text-yellow-400 mr-1" />
                        (3.4)
                      </div>
        
                      {/* Price & Cart */}
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-orange-600 font-bold md:text-2xl text-xl block">
                            ৳1,00,500
                          </span>
                          <span className="text-gray-400 line-through md:text-lg text-md">
                            ৳1,10,900
                          </span>
                        </div>
                        <button className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition">
                          <FaShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        
              <div className="flex items-center justify-center space-x-2 mt-8">
              {/* Back Button */}
              <button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
                <span>&lt;</span> Back
              </button>
        
              {/* Page 1 */}
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
                1
              </button>
        
              {/* Active Page */}
              <button className="px-4 py-2 border border-gray-900 bg-black text-white rounded-md">
                2
              </button>
        
              {/* Next Button */}
              <button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
                Next <span>&gt;</span>
              </button>
            </div>
            </div>
    );
};

export default NewArrival;