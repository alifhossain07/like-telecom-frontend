"use client";

import React from "react";

interface Product {
  id?: number;
  slug?: string;
  name?: string;
  specifications?: Array<{
    title: string;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

interface CompareSpecificationsProps {
  product1: Product | null;
  product2: Product | null;
}

// Fixed specification structure
const FIXED_SPECIFICATIONS = [
  {
    title: "Physical Specification",
    attributes: [
      { name: "Build" },
      { name: "Weight" },
      { name: "Dimensions" },
    ],
  },
  {
    title: "Network",
    attributes: [
      { name: "SIM" },
      { name: "Speed" },
      { name: "2G bands" },
      { name: "3G Bands" },
      { name: "4G Bands" },
      { name: "5G Bands" },
    ],
  },
  {
    title: "Display",
    attributes: [
      { name: "Size" },
      { name: "Type" },
      { name: "Resolution" },
    ],
  },
  {
    title: "Processor",
    attributes: [
      { name: "Chipset" },
      { name: "CPU" },
      { name: "GPU" },
    ],
  },
  {
    title: "Memory",
    attributes: [
      { name: "Internal Storage" },
      { name: "Card Slot" },
      { name: "Ram" },
    ],
  },
  {
    title: "Main Camera",
    attributes: [
      { name: "System" },
      { name: "Features" },
      { name: "Video" },
    ],
  },
  {
    title: "Selfie Camera",
    attributes: [
      { name: "System" },
      { name: "Features" },
      { name: "Video" },
    ],
  },
  {
    title: "OS",
    attributes: [{ name: "Operating System" }],
  },
  {
    title: "Connectivity",
    attributes: [
      { name: "NFC" },
      { name: "USB" },
      { name: "Radio" },
      { name: "Wifi" },
      { name: "Bluetooth" },
      { name: "3.5mm Jack" },
    ],
  },
  {
    title: "Features",
    attributes: [{ name: "Sensors" }],
  },
  {
    title: "Battery",
    attributes: [
      { name: "Type" },
      { name: "Charging" },
    ],
  },
  {
    title: "Test",
    attributes: [
      { name: "Loudspeaker" },
      { name: "Performance" },
    ],
  },
];

const CompareSpecifications: React.FC<CompareSpecificationsProps> = ({
  product1,
  product2,
}) => {
  // Helper function to find attribute value in product specifications
  const findAttributeValue = (
    product: Product | null,
    sectionTitle: string,
    attributeName: string
  ): string => {
    if (!product || !product.specifications) return "";

    // Find the section with matching title (case-insensitive)
    const section = product.specifications.find(
      (spec) => spec.title.toLowerCase() === sectionTitle.toLowerCase()
    );

    if (!section) return "";

    // Find the attribute with matching name (case-insensitive)
    const attribute = section.attributes.find(
      (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
    );

    return attribute?.value || "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[200px]">
              Specification
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[300px]">
              {product1?.name || "Product 1"}
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[300px]">
              {product2?.name || "Product 2"}
            </th>
          </tr>
        </thead>
        <tbody>
          {FIXED_SPECIFICATIONS.map((section) => (
            <React.Fragment key={section.title}>
              {/* Section Header Row */}
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800"
                >
                  {section.title}
                </td>
              </tr>

              {/* Attribute Rows */}
              {section.attributes.map((attr, attrIndex) => {
                const value1 = findAttributeValue(
                  product1,
                  section.title,
                  attr.name
                );
                const value2 = findAttributeValue(
                  product2,
                  section.title,
                  attr.name
                );

                return (
                  <tr key={`${section.title}-${attr.name}-${attrIndex}`}>
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                      {attr.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                      {value1 || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                      {value2 || "-"}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareSpecifications;

