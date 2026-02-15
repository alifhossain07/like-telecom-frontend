"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import ProductVariants from "./ProductVariants";
import toast from "react-hot-toast";
import { formatPrice } from "@/app/lib/format-utils";

interface Variant {
  variant: string;
  price: number;
  sku: string;
  qty: number;
  image: string | null;
}

interface ProductActionsProps {
  product: {
    id: number;
    slug: string;
    name: string;
    main_price: string;
    stroked_price: string;
    discount?: string | number;
    thumbnail_image?: string;
    photos?: Array<{ path: string }>;
    choice_options?: Array<{ name: string; title: string; options: string[] }>;
    colors?: string[];
    other_features?: string;
    current_stock?: number;
    model_number?: string;
    variants?: Variant[];
    whatsappNumber?: string;
  };
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, setCartOpen, setSelectedItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Dynamic options state (e.g., { "Storage": "128GB", "Region": "China", "RAM": "6GB" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Initialize color selection
  useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors, selectedColor]);

  // Initialize dynamic options from choice_options
  useEffect(() => {
    if (product.choice_options) {
      const initialOptions: Record<string, string> = {};
      let hasUpdates = false;

      product.choice_options.forEach((choice) => {
        if (choice.options.length > 0 && !selectedOptions[choice.title]) {
          initialOptions[choice.title] = choice.options[0];
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        setSelectedOptions((prev) => ({ ...prev, ...initialOptions }));
      }
    }
  }, [product.choice_options, selectedOptions]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Helper function to get color name from hex code
  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      "#9966CC": "Amethyst",
      "#7FFFD4": "Aquamarine",
      "#000000": "Midnight",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#0000FF": "Blue",
      "#FFC0CB": "Pink",
      "#FFA500": "Orange",
      "#800080": "Purple",
      "#008000": "Green",
      "#FFFF00": "Yellow",
      "#808080": "Gray",
      "#C0C0C0": "Silver",
      "#FFD700": "Gold",
    };

    const normalizedHex = hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    return colorMap[normalizedHex] || normalizedHex;
  };

  // Parse price string to number
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Calculate prices based on selected variant
  const getPrices = () => {
    if (selectedVariant) {
      const variantPrice = selectedVariant.price;
      let price = variantPrice;
      const oldPrice = variantPrice;

      // Apply discount if available
      if (product.discount) {
        const discountMatch = String(product.discount).match(/-?(\d+)/);
        const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
        if (discountPercent > 0 && discountPercent < 100) {
          price = Math.round(variantPrice * (1 - discountPercent / 100));
        }
      }

      return { price, oldPrice };
    }

    // No variant selected, use product prices
    return {
      price: parsePrice(product.main_price),
      oldPrice: parsePrice(product.stroked_price),
    };
  };

  const constructVariantString = () => {
    // Use selectedVariant if available
    if (selectedVariant?.variant) {
      return selectedVariant.variant;
    }

    const colorName = selectedColor ? getColorName(selectedColor) : "";

    // Helper to get option values in correct order based on product.choice_options definition
    const orderedOptionValues = product.choice_options
      ? product.choice_options.map(choice => selectedOptions[choice.title])
      : [];

    const variantString = [colorName, ...orderedOptionValues]
      .filter((part) => part && part.trim() !== "")
      .join("-");

    return variantString;
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check variant stock if a specific variant is matched
    if (selectedVariant && selectedVariant.qty <= 0) {
      toast.error("Selected variant is out of stock", {
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
      return;
    }

    // Check general product stock if no variant logic applies (fallback)
    if (!selectedVariant && (product.current_stock ?? 0) <= 0) {
      toast.error("Product is out of stock", {
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
      return;
    }

    const { price, oldPrice } = getPrices();

    // Get image - prefer variant image, then thumbnail, then first photo
    const image =
      selectedVariant?.image ||
      product.thumbnail_image ||
      product.photos?.[0]?.path ||
      "/images/placeholder.png";

    const variantString = constructVariantString();

    addToCart({
      id: product.id.toString(),
      slug: product.slug,
      name: product.name,
      price,
      oldPrice,
      img: image,
      qty: quantity,
      variant: variantString || undefined,
      variantImage: image,
      variantColor: selectedColor || undefined,
      variantStorage: selectedOptions["Storage"] || undefined,
      variantRegion: selectedOptions["Region"] || undefined,
    });

    // Open cart sidebar
    setCartOpen(true);

    // Google Analytics event
    if (typeof window !== "undefined") {
      const item = {
        item_id: product.id.toString(),
        item_name: product.name,
        item_brand: "",
        item_category: "",
        price,
        quantity,
        item_variant: variantString || "",
        item_sku: selectedVariant?.sku || "",
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "BDT",
          value: price * quantity,
          items: [item],
        },
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Check variant stock
    if (selectedVariant && selectedVariant.qty <= 0) {
      toast.error("Selected variant is out of stock", {
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
      return;
    }

    // Check general product stock
    if (!selectedVariant && (product.current_stock ?? 0) <= 0) {
      toast.error("Product is out of stock", {
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
      return;
    }

    const { price, oldPrice } = getPrices();

    // Get image
    const image =
      selectedVariant?.image ||
      product.thumbnail_image ||
      product.photos?.[0]?.path ||
      "/images/placeholder.png";

    const variantString = constructVariantString();

    // Add to cart
    addToCart({
      id: product.id.toString(),
      slug: product.slug,
      name: product.name,
      price,
      oldPrice,
      img: image,
      qty: quantity,
      variant: variantString || undefined,
      variantImage: image,
      variantColor: selectedColor || undefined,
      variantStorage: selectedOptions["Storage"] || undefined,
      variantRegion: selectedOptions["Region"] || undefined,
    });

    // Ensure this item is selected for checkout
    setSelectedItems([product.id.toString()]);

    // Navigate to checkout
    router.push("/checkout");
  };

  const handleOptionChange = (title: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [title]: value
    }));
  };

  return (
    <>
      {/* Dynamic Pricing Section */}
      <div className="">
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="md:text-[26px] text-[22px] font-bold text-orange-600">
            ৳{formatPrice(getPrices().price)}
          </span>
          {product.discount &&
            product.discount !== "0%" &&
            product.discount !== "0" &&
            product.discount !== "" &&
            product.discount !== 0 && (
              <>
                <span className="text-[16px] text-gray-400 line-through">
                  ৳{formatPrice(getPrices().oldPrice)}
                </span>
                <span className="px-3 py-1 bg-[#E7F3EC] text-[#0A8544] text-sm font-medium rounded-2xl">
                  {product.discount} off
                </span>
              </>
            )}

          {/* Stock Quantity Display */}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-2xl">
            In Stock: {selectedVariant ? selectedVariant.qty : product.current_stock}
          </span>
        </div>
      </div>

      {/* Product Variants - Dynamic */}
      <ProductVariants
        choiceOptions={product.choice_options || []}
        colors={product.colors || []}
        otherFeatures={product.other_features}
        currentStock={product.current_stock}
        sku={product.model_number || ""}
        variants={product.variants || []}

        // Pass initial state if needed, though ProductVariants re-initializes too
        initialColor={selectedColor}
        initialOptions={selectedOptions}

        onVariantChange={(variant) => {
          setSelectedVariant(variant);
        }}
        onColorChange={(color) => {
          setSelectedColor(color);
        }}

        // Use generic handler
        onOptionChange={handleOptionChange}
      />

      {/* Quantity Selector */}
      <div className="mb-4 flex items-center">
        <div className="text-sm font-medium text-gray-700 mr-3">Quantity:</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center w-[90px] bg-[#f4f4f4] h-[38px] border border-gray-300 rounded overflow-hidden">
            {/* Minus */}
            <button
              onClick={decrement}
              className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] bg-orange-500 rounded-full text-white hover:text-black ml-1 flex items-center justify-center font-semibold hover:bg-gray-100 transition"
            >
              −
            </button>

            {/* Quantity */}
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-full h-full bg-[#f4f4f4] text-center text-sm font-medium text-gray-800 focus:outline-none"
            />

            {/* Plus */}
            <button
              onClick={increment}
              className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] rounded-full text-white flex bg-orange-500 items-center justify-center font-semibold hover:text-black mr-1 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>

          <span className="md:text-sm text-[12px] text-[#B3D9C5] font-bold">
            Call For Online Order ({product.whatsappNumber || "09678-664664"})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 2xl:text-base text-xs bg-gray-800 text-white px-6 py-3 rounded font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 2xl:text-base text-xs bg-orange-500 text-white px-6 py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Buy Now
        </button>
      </div>
    </>
  );
};

export default ProductActions;
