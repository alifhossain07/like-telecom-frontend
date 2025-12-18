"use client";

import React from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  available: boolean;
};

type ProductListProps = {
  relatedProducts: Product[];
  recentlyViewed: Product[];
};

const ProductList: React.FC<ProductListProps> = ({
  relatedProducts,
  recentlyViewed,
}) => {
  const renderProduct = (product: Product) => (
    <div
      key={product.id}
      className="flex items-center gap-3 border-b border-gray-200 py-3 last:border-b-0"
    >
      <div className="w-36 h-24 relative flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-fill rounded"
        />
        {/* {product.discount && (
          <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr rounded-bl">
            Save {product.discount}%
          </span>
        )} */}
      </div>
      <div className="flex-1 space-y-1">
        {product.available ? (
          <span className="text-xs text-orange-400 mt-1">• Available</span>
        ) : (
          <span className="text-xs text-red-400 mt-1">• Out of stock</span>
        )}
        <p className="text-[18px] font-medium">{product.name}</p>
        <div className="flex items-center gap-2 text-orange-500 font-semibold">
          <span className="text-[22px]">৳{product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-[12px]">
              ৳{product.oldPrice}
            </span>
          )}
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-auto rounded-xl">
      <div className="h-auto bg-white rounded-xl p-5">
        <h3 className="text-lg font-semibold border-b-2 pb-3 ">Related Products</h3>
        <div className="space-y-2">
          {relatedProducts.map(renderProduct)}
        </div>
      </div>

      <div className="h-auto bg-white rounded-xl p-5">
        <h3 className="text-lg font-semibold  border-b-2 pb-3 ">Recently Viewed Product</h3>
        <div className="space-y-2">
          {recentlyViewed.map(renderProduct)}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
