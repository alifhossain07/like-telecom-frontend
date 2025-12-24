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

interface ProductSpecificationsProps {
  product: Product | null;
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

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  product,
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
    <div className="w-full">
      <div className="space-y-4">
        {FIXED_SPECIFICATIONS.map((section, sectionIndex) => {
          return (
            <div key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Section Header */}
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="text-sm font-bold text-gray-800">{section.title}</h4>
              </div>

              {/* Attributes */}
              <div className="divide-y divide-gray-200">
                {section.attributes.map((attr, attrIndex) => {
                  const value = findAttributeValue(product, section.title, attr.name);

                  return (
                    <div
                      key={`${section.title}-${attr.name}-${attrIndex}`}
                      className="px-4 py-3"
                    >
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {attr.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {value || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSpecifications;

