'use client';

import { useState } from 'react';
import { FaTruck } from 'react-icons/fa';
import ShippingModal from './ShippingModal';

export default function ShippingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex-1 px-4 py-4 border bg-[#f4f4f4] border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <FaTruck className="w-5 h-5 text-black" />
        <span>Shipping & Charge</span>
      </button>
      
      <ShippingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

