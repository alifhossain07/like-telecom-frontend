import React from 'react';

// Defining the shape of the product for type safety
interface Product {
  name: string;
  price: string;
}

interface PriceTableProps {
  categoryName?: string; // e.g., "iPhone"
  location?: string;     // e.g., "Bangladesh"
  year?: string | number;
  data?: Product[];
}

const PriceTable: React.FC<PriceTableProps> = ({
  categoryName = "iPhone",
  location = "Bangladesh",
  year = "2025",
  // Defaulting to the static data from your image
  data = [
    { name: "iPhone 13", price: "63,999" },
    { name: "iPhone 13", price: "63,999" },
    { name: "iPhone 13", price: "63,999" },
    { name: "iPhone 13", price: "63,999" },
  ],
}) => {
  return (
    <div className="w-full mt-5 mx-auto mb-10 font-sans">
      {/* Dynamic Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Latest {categoryName} Price List in {location}
      </h2>

      {/* Table Container */}
      <div className="overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f0f0f] text-white">
              <th className="py-3 px-4 font-semibold text-sm border-r border-gray-700">
                {categoryName} Smartphone Name
              </th>
              <th className="py-3 px-4 font-semibold text-sm">
                Latest Price in BDT {year}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-700 text-sm border-r border-gray-100">
                  {item.name} Price in {location}
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                  {item.price} BDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;