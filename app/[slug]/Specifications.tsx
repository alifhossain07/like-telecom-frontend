"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Attribute {
  name: string;
  value: string;
}

interface SpecificationSection {
  title: string;
  attributes: Attribute[];
}

interface SpecificationsProps {
  specifications: SpecificationSection[];
}

const Specifications: React.FC<SpecificationsProps> = ({ specifications }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    specifications.map((_, index) => index)
  );

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!specifications.length) return null;

  return (
    // FIX: Changed w-6/12 to w-full. Removed md:mx-auto for better alignment.
    <div className="w-full max-w-[1140px] space-y-4 bg-white p-4 md:p-6 rounded-xl">
      <h1 className="text-xl md:text-2xl font-semibold">Specifications</h1>

      {specifications.map((section, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={`${section.title}-${index}`}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm md:text-base">{section.title}</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              {/* FIX: Added overflow-x-auto to handle long text on tiny screens */}
              <div className="overflow-x-auto">
                <table className="w-full border-t border-gray-200 table-fixed md:table-auto">
                  <tbody>
                    {section.attributes.map((row, i) => (
                      <tr key={`${row.name}-${i}`} className="border-b last:border-b-0">
                        {/* FIX: Changed w-[20%] to w-1/3 and added min-w for mobile readability */}
                        <td className="w-1/3 min-w-[100px] px-4 py-3 text-xs md:text-sm font-medium text-gray-700 bg-gray-50">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-xs md:text-sm text-gray-600 break-words">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Specifications;