"use client"
import Link from 'next/link';
import React from 'react';

const MobileViewButtons = () => {
    return (
        <div className='w-11/12 mx-auto md:hidden flex gap-3 mb-5'>
            {/* Exclusive Sales - Orange Glow */}
            <Link
                href="/exclusivedeals"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-xs sm:text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[#FFD522] to-[#FF6B01] animate-glow text-center transition-all shadow-md active:scale-95 shadow-orange-400"
            >
                <span>🔥</span>
                Exclusive Sales
            </Link>

            {/* Hot Offers - Blue/Indigo Glow (Custom Color Glow) */}
            <Link
                href="/offers"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-xs sm:text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-center transition-all shadow-md active:scale-95 shadow-indigo-500/50"
                style={{
                    animation: 'blue-glow 2s infinite ease-in-out'
                }}
            >
                <span>🎁</span>
                Hot Offers

                {/* Inline Animation Style Tag */}
                <style jsx>{`
                    @keyframes blue-glow {
                        0%, 100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.4); }
                        50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.8); }
                    }
                `}</style>
            </Link>
        </div>
    );
};

export default MobileViewButtons;