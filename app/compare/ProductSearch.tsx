"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Product {
  id: number;
  slug: string;
  name: string;
  thumbnail_image?: string;
  main_price?: string | number;
}

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  loading?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onProductSelect,
  placeholder = "Search for products...",
  loading = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/products/search?suggest=1&query_key=${encodeURIComponent(
          searchQuery
        )}&type=product`
      );

      if (res.ok) {
        const data = await res.json();
        
        // Extract products from the response
        // The API can return suggestions in different formats
        let products: Product[] = [];
        let suggestions: unknown[] = [];
        
        // Try different response structures (handle nested data.data structure)
        if (Array.isArray(data)) {
          suggestions = data;
        } else if (data.data) {
          // Handle nested structure: { success: true, data: { data: [...] } }
          if (Array.isArray(data.data)) {
            suggestions = data.data;
          } else if (data.data.data && Array.isArray(data.data.data)) {
            suggestions = data.data.data;
          } else if (data.data.suggestions && Array.isArray(data.data.suggestions)) {
            suggestions = data.data.suggestions;
          } else if (data.data.items && Array.isArray(data.data.items)) {
            suggestions = data.data.items;
          }
        } else if (data.suggestions && Array.isArray(data.suggestions)) {
          suggestions = data.suggestions;
        } else if (data.items && Array.isArray(data.items)) {
          suggestions = data.items;
        }
        
        // Filter and map suggestions to products
        products = suggestions
          .filter((item: unknown): item is Record<string, unknown> => {
            if (typeof item !== 'object' || item === null) return false;
            const obj = item as Record<string, unknown>;
            // Must have either slug or name/query
            const hasSlug = typeof obj.slug === 'string' && obj.slug.length > 0;
            const hasName = (typeof obj.name === 'string' && obj.name.length > 0) || 
                           (typeof obj.query === 'string' && obj.query.length > 0);
            return hasSlug || hasName;
          })
          .slice(0, 10) // Limit to 10 results
          .map((item): Product => {
            // Get slug - try different possible locations
            const slug = (typeof item.slug === 'string' ? item.slug : '') || 
                        (typeof item.seo === 'object' && item.seo !== null && typeof (item.seo as Record<string, unknown>).slug === 'string' ? (item.seo as Record<string, unknown>).slug as string : '') || 
                        (typeof item.links === 'object' && item.links !== null && typeof (item.links as Record<string, unknown>).details === 'string' ? ((item.links as Record<string, unknown>).details as string).split('/').pop() || '' : '') ||
                        '';
            
            // Get name
            const name = (typeof item.name === 'string' ? item.name : '') || 
                        (typeof item.query === 'string' ? item.query : '') || 
                        '';
            
            // Get image
            const thumbnail_image = (typeof item.thumbnail_image === 'string' ? item.thumbnail_image : '') || 
                                   (typeof item.image === 'string' ? item.image : '') || 
                                   (typeof item.thumbnail_img === 'string' ? item.thumbnail_img : '') || 
                                   '';
            
            // Get price
            const main_price = (typeof item.main_price === 'string' || typeof item.main_price === 'number' ? String(item.main_price) : '') || 
                             (typeof item.price === 'string' || typeof item.price === 'number' ? String(item.price) : '') || 
                             (typeof item.base_discounted_price === 'string' || typeof item.base_discounted_price === 'number' ? String(item.base_discounted_price) : '') ||
                             '';
            
            // Get id - ensure it's always a number
            let id: number;
            if (typeof item.id === 'number') {
              id = item.id;
            } else if (typeof item.id === 'string') {
              const parsedId = parseInt(item.id, 10);
              id = isNaN(parsedId) ? Date.now() : parsedId;
            } else if (slug) {
              // Use hash of slug as id
              id = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            } else {
              id = Date.now();
            }
            
            return {
              id,
              slug: slug || '',
              name: name || '',
              thumbnail_image: thumbnail_image || '',
              main_price: main_price || '',
            };
          })
          .filter((p: Product) => p.slug && p.name); // Only include products with both slug and name

        console.log("Search results:", products);
        setResults(products);
        setShowResults(products.length > 0);
      } else {
        console.error("Search API error:", res.status, res.statusText);
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    // Fetch full product data if we only have basic info
    if (product.slug && (!product.id || !product.name)) {
      try {
        const res = await fetch(`/api/products/${product.slug}`);
        if (res.ok) {
          const fullProduct = await res.json();
          onProductSelect(fullProduct);
        } else {
          // If fetch fails, use the basic product data
          onProductSelect(product);
        }
      } catch (error) {
        console.error("Error fetching full product:", error);
        // If fetch fails, use the basic product data
        onProductSelect(product);
      }
    } else {
      onProductSelect(product);
    }
    setQuery("");
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center bg-gray-100 border border-gray-300 rounded-full overflow-visible">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder || "Search your favorite accessories"}
          className="flex-1 min-w-0 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none text-[9px] sm:text-[10px] md:text-xs lg:text-base"
          disabled={loading}
        />
        {isSearching ? (
          <div className="mr-0.5 sm:mr-1 md:mr-1.5 lg:mr-2 flex-shrink-0">
            <div className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (query.trim().length >= 2) {
                performSearch(query);
              }
            }}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors mr-0.5 sm:mr-0.5 md:mr-1 lg:mr-1 flex-shrink-0 z-10"
            aria-label="Search"
          >
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left border-b last:border-b-0"
            >
              {product.thumbnail_image && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.thumbnail_image}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                {product.main_price && (
                  <p className="text-xs text-gray-500">
                    {typeof product.main_price === "string"
                      ? product.main_price
                      : `৳${product.main_price}`}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;

