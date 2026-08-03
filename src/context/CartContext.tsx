"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product, SizeOption } from "@/lib/notion";

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  size: SizeOption;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, sizeIdx: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product: Product, sizeIdx: number) => {
    const size = product.sizes[sizeIdx] || product.sizes[0];
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.size.size === size.size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.size.size === size.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          size,
          quantity: 1,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && item.size.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const getTotalItems = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const getTotalPrice = useCallback(() =>
    items.reduce((sum, item) => sum + item.size.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}