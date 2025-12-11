"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Product, CartItem, CartContextValue } from "@/types";

// ========================================
// Context作成
// ========================================

const CartContext = createContext<CartContextValue | null>(null);

// ========================================
// Provider実装
// ========================================

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  // カートアイテムの状態
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ----------------------------------------
  // カートに商品を追加
  // ----------------------------------------
  const addItem = useCallback((product: Product) => {
    setCartItems((prev) => {
      // 既にカートに存在するか確認
      const existingItem = prev.find((item) => item.product.id === product.id);

      if (existingItem) {
        // 存在する場合は数量を+1
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 存在しない場合は新規追加
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  // ----------------------------------------
  // カートから商品を削除
  // ----------------------------------------
  const removeItem = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  }, []);

  // ----------------------------------------
  // 商品の数量を更新
  // ----------------------------------------
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      // 数量が0以下の場合は削除
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  // ----------------------------------------
  // カートを空にする
  // ----------------------------------------
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // ----------------------------------------
  // 合計金額を計算（メモ化）
  // ----------------------------------------
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  // ----------------------------------------
  // 合計アイテム数を計算（メモ化）
  // ----------------------------------------
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // ----------------------------------------
  // Context値
  // ----------------------------------------
  const value: CartContextValue = useMemo(
    () => ({
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems,
    }),
    [
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ========================================
// カスタムフック
// ========================================

/**
 * カートコンテキストを使用するカスタムフック
 * @throws CartProvider外で使用された場合にエラー
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

// デフォルトエクスポート
export default CartContext;
