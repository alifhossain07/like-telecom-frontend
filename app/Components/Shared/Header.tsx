import Image from "next/image";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineHeadsetMic, MdOutlineLocalShipping } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";

import { FiSearch, FiShoppingCart, FiUser, FiGift } from "react-icons/fi";
const Header = () => {
  return (
    <div className=" ">
      <div>
        {/* Top Part */}
        <div className=" py-4 shadow-xl  ">
          <div className="justify-between flex w-10/12 mx-auto">
            <div className="flex font-semibold text-green-800 gap-5">
              <div className="flex items-center gap-2">
                <MdOutlineLocalShipping className="text-lg" />
                Order Tracking
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineHeadsetMic className="text-lg" />
                Service Center
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <FaMapMarkerAlt className="text-lg" />
                Store Locations
              </div>
            </div>
            <div className="font-semibold text-green-800">
              Contact Us 24/7 : +--854789956
            </div>
          </div>
        </div>

        {/* Middle Part */}

        <div className="w-10/12 mx-auto mt-3 flex items-center justify-between pb-4">
          <div>
            <Image src="/images/logo.png" alt="alt" width={150} height={150} />
          </div>
          <div className="relative w-4/12">
            {" "}
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-200 border border-black rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md cursor-pointer">
              <FiSearch />
            </div>
          </div>
          <div className="flex font-semibold gap-4">
            <button className=" flex items-center gap-1 bg-orange-500 text-white px-8 py-2 rounded-xl">
              <FiGift />
              Offers
            </button>
            <button className="bg-gray-200 px-6 rounded-xl">
              Exclusive Sale
            </button>
            <button className="bg-gray-200 px-6 rounded-xl">Corporate</button>
            <button className="bg-gray-200 px-6 rounded-xl flex items-center gap-1">
              {" "}
              <FiShoppingCart /> 01 Items
            </button>
            <button className="bg-gray-200 px-6 rounded-xl flex items-center gap-1">
              {" "}
              <FiUser /> Login & Others
            </button>
          </div>
        </div>

        {/* End Part */}
        <div className="bg-orange-500">
          <div className="w-10/12 mx-auto flex justify-between h-14 items-center">
            <div>
              <ul className="flex gap-10 text-white font-semibold">
                <li className="flex items-center gap-2">iPhone <FiChevronDown className="text-white text-sm" /></li>
                <li className="flex items-center gap-2" >Samsung <FiChevronDown className="text-white text-lg" /></li>
                <li className="flex items-center gap-2">Redmi <FiChevronDown className="text-white text-lg" /> </li>
                <li className="flex items-center gap-2">Poco <FiChevronDown className="text-white text-lg" /></li>
                <li className="flex items-center gap-2">Walton <FiChevronDown className="text-white text-lg" /></li>
                <li className="flex items-center gap-2">Xiaomi <FiChevronDown className="text-white text-lg" /></li>
                <li className="flex items-center gap-2">Huawei <FiChevronDown className="text-white text-lg" /></li>
              </ul>
            </div>
            <div className="bg-black flex items-center px-4 text-white h-full ">

                Used Device
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
