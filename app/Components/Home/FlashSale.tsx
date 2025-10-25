import React from 'react';
import { FiChevronRight } from "react-icons/fi";
const FlashSale = () => {
    return (
        <div className='w-10/12 mx-auto'>
            {/* Heading Section */}
            <div className='flex justify-between  items-center py-6'>
                <div>
                    <h1 className='text-4xl mb-3 font-bold'>
                        Flash Sale
                    </h1>
                    <p className='text-xl text-gray-600'>
                        Explore Brand New Products Crafted for Style , Quality and Innovation
                    </p>
                </div>
                <div>
                    <button className='bg-orange-500 flex items-center gap-3 text-white px-8 py-3 rounded-xl font-semibold text-lg'>See More <FiChevronRight className="text-white text-xl" /></button>
                       
                    
                </div>
            </div>
        </div>
         
    
    );
};

export default FlashSale;