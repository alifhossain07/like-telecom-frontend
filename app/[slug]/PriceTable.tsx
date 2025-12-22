"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Defining the shape of the product for type safety
interface PriceTableItem {
  name: string;
  price: string;
}

interface CategoryProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  featured_specs?: unknown[];
}

interface PriceTableProps {
  categoryName?: string;
  categorySlug?: string;
  location?: string;
  year?: string | number;
  data?: PriceTableItem[]; // Made optional since we'll fetch from API
}

const PriceTable: React.FC<PriceTableProps> = ({
  categoryName = "iPhone",
  categorySlug,
  location = "Bangladesh",
  year = "2025",
  data, // Fallback data if provided
}) => {
  const [products, setProducts] = useState<PriceTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If categorySlug is provided, fetch products from category API
    if (categorySlug) {
      setLoading(true);
      setError(null);
      
      axios
        .get(`/api/products/category/${categorySlug}`)
        .then((res) => {
          if (res.data.success && res.data.products) {
            // Transform category products to PriceTableItem format
            const transformedProducts: PriceTableItem[] = res.data.products.map(
              (product: CategoryProduct) => ({
                name: product.name,
                price: product.price.toLocaleString('en-BD'),
              })
            );
            setProducts(transformedProducts);
          } else {
            setError('No products found');
          }
        })
        .catch((err) => {
          console.error('Error fetching category products:', err);
          setError('Failed to load products');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (data && data.length > 0) {
      // Use provided data if no categorySlug
      setProducts(data);
    }
  }, [categorySlug, data]);

  // Use fetched products or fallback to provided data
  const displayData = products.length > 0 ? products : (data || []);

  return (
    <div className="w-full mt-5 mx-auto mb-10 font-sans">
      {/* Dynamic Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Latest {categoryName} Price List in {location}
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Table Container */}
      {!loading && displayData.length > 0 && (
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
              {displayData.map((item, index) => (
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
      )}

      {/* No Products State */}
      {!loading && !error && displayData.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>No products available</p>
        </div>
      )}
    </div>
  );
};

export default PriceTable;