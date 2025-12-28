"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductItem {
  id: number;
  slug: string;
  name: string;
  thumbnail_image: string;
  has_discount: boolean;
  discount?: string;
  stroked_price?: string;
  main_price: string;
  rating?: number;
  sales?: number;
}

interface ProductListProps {
  relatedProducts: ProductItem[];
  recentlyViewed: ProductItem[];
}

const ProductList: React.FC<ProductListProps> = ({ relatedProducts, recentlyViewed }) => {
  const [lastViewed, setLastViewed] = useState<ProductItem[]>([]);
  const [loadingLastViewed, setLoadingLastViewed] = useState(false);

  useEffect(() => {
    const fetchLastViewed = async () => {
      // Check if user is logged in (has token in localStorage)
      const token = typeof window !== "undefined" ? localStorage.getItem("like_auth_token") : null;
      
      if (!token) {
        // User not logged in, don't fetch
        return;
      }

      setLoadingLastViewed(true);
      try {
        const res = await fetch("/api/products/last-viewed", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (json.success && json.data && Array.isArray(json.data)) {
          // Transform the API response to match ProductItem interface
          const transformed = json.data.map((item: ProductItem) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            thumbnail_image: item.thumbnail_image,
            has_discount: item.has_discount || false,
            discount: item.discount,
            stroked_price: item.stroked_price,
            main_price: item.main_price,
            rating: item.rating,
            sales: item.sales,
          }));
          setLastViewed(transformed);
        }
      } catch (error) {
        console.error("Error fetching last viewed products:", error);
      } finally {
        setLoadingLastViewed(false);
      }
    };

    fetchLastViewed();
  }, []);

  const renderProduct = (product: ProductItem) => (
    <Link
      href={`/${product.slug}`}
      key={product.id}
      className="flex items-center gap-3 border-b border-gray-200 py-3 last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <div className="w-36 h-24 relative flex-shrink-0">
        <Image
          src={product.thumbnail_image}
          alt={product.name}
          fill
          className="object-contain rounded"
        />
        {product.has_discount && product.discount && (
          <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr rounded-bl">
            {product.discount}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-[18px] font-medium">{product.name}</p>
        <div className="flex items-center gap-2 text-orange-500 font-semibold">
          <span className="text-[22px]">{product.main_price}</span>
          {product.stroked_price && (
            <span className="text-gray-400 line-through text-[12px]">
              {product.stroked_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6 h-auto rounded-xl">
      {relatedProducts.length > 0 && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Related Products</h3>
          <div className="space-y-2">{relatedProducts.map(renderProduct)}</div>
        </div>
      )}

      {loadingLastViewed && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Last Viewed Products</h3>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {lastViewed.length > 0 && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Last Viewed Products</h3>
          <div className="space-y-2">{lastViewed.map(renderProduct)}</div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Recently Viewed Products</h3>
          <div className="space-y-2">{recentlyViewed.map(renderProduct)}</div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
