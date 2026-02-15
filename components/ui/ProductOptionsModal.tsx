"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/format-utils";

type Brand = {
  id: number;
  name: string;
};

type FeaturedSpec = {
  icon: string;
  text: string;
};

type ProductVariant = {
  variant: string;
  price: number;
  sku: string;
  qty: number;
  image: string | null;
};

type ChoiceOption = {
  name: string;
  title: string;
  options: string[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type ProductType = {
  id: number;
  name: string;
  main_price: number | string;
  stroked_price: number | string;
  discount: string;
  brand: Brand;
  product_compatible: string[];
  description: string;
  photos: { path: string }[];
  colors: string[];
  choice_options?: ChoiceOption[];
  thumbnail_image?: string;
  featured_specs: FeaturedSpec[];
  current_stock: number;
  est_shipping_time: number;
  model_number?: string;
  connection_type?: string;
  weight: number;
  other_features?: string;
  faqs?: FAQItem[];
  variants: ProductVariant[];
};

type Props = {
  slug: string | null;
  open: boolean;
  onClose: () => void;
};

const parsePrice = (priceStr: string | number | null | undefined): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;

  const cleaned = String(priceStr)
    .replace(/[^\d.]/g, "")
    .trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export default function ProductOptionsModal({ slug, open, onClose }: Props) {
  const { addToCart, setCartOpen } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  // Dynamic options state (e.g., { "Storage": "128GB", "Region": "China", "RAM": "6GB" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product details when opened
  useEffect(() => {
    if (!open || !slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setQuantity(1);
      setSelectedColor("");
      setSelectedOptions({});

      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: ProductType = await res.json();
        setProduct(data);

        // Initialize selections
        if (data.colors && data.colors.length > 0) {
          console.log("Initializing color:", data.colors[0]);
          setSelectedColor(data.colors[0]);
        }

        // Initialize dynamic options
        if (data.choice_options) {
          const initialOptions: Record<string, string> = {};
          data.choice_options.forEach((choice) => {
            if (choice.options.length > 0) {
              initialOptions[choice.title] = choice.options[0];
            }
          });
          console.log("Initializing options:", initialOptions);
          setSelectedOptions(initialOptions);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, slug]);

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

    const normalizedHex = hex.startsWith("#")
      ? hex.toUpperCase()
      : `#${hex.toUpperCase()}`;
    return colorMap[normalizedHex] || normalizedHex;
  };

  // Find matching variant based on selected attributes
  const findMatchingVariant = (): ProductVariant | null => {
    if (!product) return null;

    const parts: string[] = [];
    if (selectedColor) parts.push(getColorName(selectedColor));

    // Append options in consistent order (implicit from choice_options array order)
    if (product.choice_options) {
      product.choice_options.forEach(choice => {
        if (selectedOptions[choice.title]) {
          parts.push(selectedOptions[choice.title]);
        }
      });
    }

    if (parts.length === 0) return null;

    const variantString = parts.join("-");
    const matched = product.variants.find((v) => v.variant === variantString) || null;

    // Debug logging for variant matching
    // console.log("Constructed variant string:", variantString);
    // console.log("Matched variant:", matched);

    return matched;
  };

  // Get current prices based on selected variant (memoized for performance)
  const currentPrices = useMemo((): { price: number; oldPrice: number } => {
    const matchedVariant = findMatchingVariant();
    const productMainPrice = parsePrice(product?.main_price);
    const productStrokedPrice = parsePrice(product?.stroked_price);

    if (matchedVariant && product) {
      // Variant price is the original/stroked price
      const variantPrice = matchedVariant.price;
      let discountedPrice: number;

      // Calculate discounted price from variant price using discount percentage
      if (product.discount) {
        const discountMatch = String(product.discount).match(/-?(\d+)/);
        const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
        if (discountPercent > 0 && discountPercent < 100) {
          discountedPrice = Math.round(variantPrice * (1 - discountPercent / 100));
        } else {
          discountedPrice = variantPrice;
        }
      } else {
        discountedPrice = variantPrice;
      }

      return {
        price: discountedPrice,
        oldPrice: variantPrice,
      };
    }

    // No variant selected, use product prices
    return {
      price: productMainPrice,
      oldPrice: productStrokedPrice,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedColor, selectedOptions]);

  const handleConfirmAdd = () => {
    if (!product || !slug) return;

    const matchedVariant = findMatchingVariant();

    // Check variant stock if a specific variant is matched
    if (matchedVariant && matchedVariant.qty <= 0) {
      return; // Don't proceed, inline message will show
    }

    // Check general product stock if no variant logic applies
    if (!matchedVariant && product.current_stock <= 0) {
      return; // Don't proceed, inline message will show
    }

    setAdding(true);
    setTimeout(() => {
      if (!product) {
        setAdding(false);
        return;
      }

      const matchedVariant = findMatchingVariant();

      // Variant-based pricing logic
      const productMainPrice = parsePrice(product.main_price);
      const productStrokedPrice = parsePrice(product.stroked_price);

      let price: number;
      let oldPrice: number;

      if (matchedVariant) {
        const variantPrice = matchedVariant.price;
        oldPrice = variantPrice;

        if (product.discount) {
          const discountMatch = String(product.discount).match(/-?(\d+)/);
          const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
          if (discountPercent > 0 && discountPercent < 100) {
            price = Math.round(variantPrice * (1 - discountPercent / 100));
          } else {
            price = variantPrice;
          }
        } else {
          price = variantPrice;
        }
      } else {
        price = productMainPrice;
        oldPrice = productStrokedPrice;
      }

      const image =
        product.thumbnail_image ||
        product.photos[0]?.path ||
        "/images/placeholder.png";

      // Build variant string dynamically based on selections
      let variantString: string | undefined = undefined;
      const parts: string[] = [];
      if (selectedColor) parts.push(getColorName(selectedColor));

      if (product.choice_options) {
        product.choice_options.forEach(choice => {
          if (selectedOptions[choice.title]) {
            parts.push(selectedOptions[choice.title]);
          }
        });
      }

      if (parts.length > 0) {
        variantString = parts.join("-");
      }

      console.log("----- ADD TO CART (Modal) -----");
      console.log("Product ID:", product.id);
      console.log("Name:", product.name);
      console.log("Selected Color:", selectedColor);
      console.log("Selected Options:", selectedOptions);
      console.log("Constructed Variant String:", variantString);
      console.log("Matched Variant Object:", matchedVariant);
      console.log("-------------------------------");

      addToCart({
        id: product.id.toString(),
        slug,
        name: product.name,
        price,
        oldPrice,
        img: image,
        qty: quantity,
        variant: variantString || undefined,
        variantImage: image,
        variantColor: selectedColor || undefined,
        // Using dynamic options for both generic storage/region fields for backward compatibility
        variantStorage: selectedOptions["Storage"] || undefined,
        variantRegion: selectedOptions["Region"] || undefined,
      });

      if (typeof window !== "undefined") {
        const item = {
          item_id: product.id.toString(),
          item_name: product.name,
          item_brand: product.brand?.name || "",
          item_category: "",
          price,
          quantity,
          item_variant: matchedVariant?.variant || "",
          item_sku: matchedVariant?.sku || "",
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

      setCartOpen(true);
      setAdding(false);
      onClose();
    }, 500);
  };

  const handleOptionClick = (title: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [title]: value }));
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[20000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[20001] w-11/12 max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm md:text-base font-semibold">Choose Options</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500 text-sm py-4">{error}</p>
          )}

          {!loading && !error && product && (
            <>
              {/* Top: Image + basic info */}
              <div className="flex gap-3">
                <div className="w-24 h-24 flex-shrink-0 bg-[#f5f5f5] rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      product.thumbnail_image ||
                      product.photos[0]?.path ||
                      "/images/placeholder.png"
                    }
                    alt={product.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    {product.current_stock === 0 ? (
                      <span className="text-red-600 font-semibold">
                        Stock Out
                      </span>
                    ) : product.current_stock < 5 ? (
                      <span className="text-orange-500 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        In Stock
                      </span>
                    )}
                    <span className="text-gray-400">• ID: {product.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-semibold text-lg">
                      ৳{formatPrice(currentPrices.price)}
                    </span>
                    <span className="line-through text-gray-400 text-xs">
                      ৳{formatPrice(currentPrices.oldPrice)}
                    </span>
                    <span className="px-2 py-[2px] rounded-full bg-green-100 text-green-600 text-[10px] font-semibold">
                      {product.discount} OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Warning Message */}
              {(() => {
                const matchedVariant = findMatchingVariant();
                const isOutOfStock = matchedVariant
                  ? matchedVariant.qty <= 0
                  : product.current_stock <= 0;

                if (isOutOfStock) {
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800">This variant is out of stock</p>
                        <p className="text-xs text-red-600 mt-0.5">Please select a different combination or check back later.</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color: string, index: number) => {
                      const isSelected = color === selectedColor;
                      const colorName = getColorName(color);
                      return (
                        <div key={index} className="relative group">
                          <button
                            onClick={() => setSelectedColor(color)}
                            style={{ backgroundColor: color }}
                            className={`w-8 h-8 rounded-md border-2 transition ${isSelected
                              ? "border-gray-800 scale-110"
                              : "border-gray-300 hover:border-gray-400"
                              }`}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            {colorName}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Choice Options (Storage, Region, RAM, etc.) */}
              {product.choice_options &&
                product.choice_options.map(
                  (choice: ChoiceOption, choiceIndex: number) => (
                    <div key={choiceIndex} className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">
                        {choice.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {choice.options.map(
                          (option: string, optionIndex: number) => {
                            const isSelected = selectedOptions[choice.title] === option;

                            return (
                              <button
                                key={optionIndex}
                                onClick={() => handleOptionClick(choice.title, option)}
                                className={`px-3 py-1 rounded-full border text-xs transition ${isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
                                  }`}
                              >
                                {option}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )}

              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrement}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FiMinus className="text-sm" />
                  </button>
                  <span className="min-w-[24px] text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FiPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Small specs preview */}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-xl border border-gray-300 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={
              adding || loading || !product || product.current_stock === 0 || (() => {
                const matchedVariant = findMatchingVariant();
                return matchedVariant ? matchedVariant.qty <= 0 : false;
              })()
            }
            onClick={handleConfirmAdd}
            className={`w-1/2 py-2 rounded-xl text-xs md:text-sm font-semibold text-white transition ${adding ||
              loading ||
              !product ||
              product.current_stock === 0 ||
              (() => {
                const matchedVariant = findMatchingVariant();
                return matchedVariant ? matchedVariant.qty <= 0 : false;
              })()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}