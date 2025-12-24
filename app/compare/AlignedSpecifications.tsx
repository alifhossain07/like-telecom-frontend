"use client";

import React from "react";

interface Product {
  id: number;
  slug?: string;
  name: string;
  brand?: {
    name: string;
  };
  other_features?: string;
  warranty?: {
    text?: string;
    logo?: string;
  } | string;
  specifications?: Array<{
    title: string;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

interface AlignedSpecificationsProps {
  product1: Product | null;
  product2: Product | null;
  brand1: string;
  brand2: string;
  shortDescription1: string;
  shortDescription2: string;
  warranty1: string;
  warranty2: string;
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

const AlignedSpecifications: React.FC<AlignedSpecificationsProps> = ({
  product1,
  product2,
  brand1,
  brand2,
  shortDescription1,
  shortDescription2,
  warranty1,
  warranty2,
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
    <div className="w-full min-w-full">
      <table className="w-full border-collapse text-[9px] sm:text-xs md:text-sm">
        <tbody>
          {/* Product Info Rows - Brand, Short Description, Warranty */}
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Brand
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {brand1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {brand2 || "-"}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Short Description
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {shortDescription1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {shortDescription2 || "-"}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Warranty
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {warranty1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {warranty2 || "-"}
            </td>
          </tr>

          {/* Specifications Sections */}
          {FIXED_SPECIFICATIONS.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              {/* Section Header Row - spans all 3 columns */}
              <tr>
                <td
                  colSpan={3}
                  className="border-b border-gray-200 bg-red-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-bold text-red-600"
                >
                  {section.title.toUpperCase()}
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
                  <tr key={`${section.title}-${attr.name}-${attrIndex}`} className="border-b border-gray-200">
                    {/* Attribute Name Column */}
                    <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
                      {attr.name}
                    </td>
                    {/* Product 1 Value Column */}
                    <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
                      {value1 || "-"}
                    </td>
                    {/* Product 2 Value Column */}
                    <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
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

export default AlignedSpecifications;

