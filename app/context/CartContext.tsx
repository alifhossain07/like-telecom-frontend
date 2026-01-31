"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type CartItem = {
  id: string | number; // database product ID
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  img: string;
  qty: number;
  variant?: string;          // Full variant string like "Amethyst-128GB-USA"
  variantImage?: string;
  variantColor?: string;     // Selected color (hex code)
  variantStorage?: string;  // Selected storage
  variantRegion?: string;   // Selected region
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  increaseQty: (id: string | number) => void;
  decreaseQty: (id: string | number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (state: boolean) => void;

  selectedItems: (string | number)[];
  setSelectedItems: React.Dispatch<React.SetStateAction<(string | number)[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      console.warn("Failed to load cart");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Load selected items
  useEffect(() => {
    const savedSelected = localStorage.getItem("selectedItems");
    if (savedSelected) setSelectedItems(JSON.parse(savedSelected));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const addToCart = (item: CartItem) => {
    console.log("----- CART CONTEXT: addToCart -----");
    console.log("Adding Item:", item.name);
    console.log("Variant String:", item.variant);
    console.log("Variant Options:", {
      color: item.variantColor,
      storage: item.variantStorage,
      region: item.variantRegion
    });
    console.log("-----------------------------------");

    // Create unique key: id + variant (treat different variants as separate items)
    const itemKey = item.variant ? `${item.id}-${item.variant}` : `${item.id}`;

    // Check if the exact same product with same variant already exists
    const exists = cart.find((i) => {
      const existingKey = i.variant ? `${i.id}-${i.variant}` : `${i.id}`;
      return existingKey === itemKey;
    });

    if (exists) {
      // Same product + same variant: increase quantity
      setCart((prev) =>
        prev.map((i) => {
          const existingKey = i.variant ? `${i.id}-${i.variant}` : `${i.id}`;
          return existingKey === itemKey ? { ...i, qty: i.qty + item.qty } : i;
        })
      );
    } else {
      // Different variant or new product: add as new item
      setCart((prev) => {
        const newCart = [...prev, item];
        // Auto-select the newly added item (use item.id to match CartSidebar logic)
        setSelectedItems((prevSelected) => {
          if (!prevSelected.includes(item.id)) {
            return [...prevSelected, item.id];
          }
          return prevSelected;
        });
        return newCart;
      });
    }

    toast.success("Product added to cart!", {
      position: "top-right",
      style: {
        background: "#FF6D00",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "8px",
      },
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const increaseQty = (id: string | number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decreaseQty = (id: string | number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
    );

  const clearCart = () => {
    setCart([]);
    setSelectedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartOpen,
        setCartOpen,
        selectedItems,
        setSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
