"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Product, FavoritesContextValue } from "@/types";

// ========================================
// LocalStorage キー
// ========================================
const STORAGE_KEY = "ec-favorites";

// ========================================
// Context作成
// ========================================

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ========================================
// Provider実装
// ========================================

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  // お気に入り商品の状態
  const [favorites, setFavorites] = useState<Product[]>([]);
  // 初期化完了フラグ (SSR対策)
  const [isInitialized, setIsInitialized] = useState(false);

  // ----------------------------------------
  // LocalStorageから読み込み (マウント時)
  // ----------------------------------------
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  // ----------------------------------------
  // LocalStorageに保存 (変更時)
  // ----------------------------------------
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
      }
    }
  }, [favorites, isInitialized]);

  // ----------------------------------------
  // お気に入りに追加
  // ----------------------------------------
  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      // 既に存在する場合は追加しない
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  // ----------------------------------------
  // お気に入りから削除
  // ----------------------------------------
  const removeFavorite = useCallback((productId: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // ----------------------------------------
  // お気に入り判定
  // ----------------------------------------
  const isFavorite = useCallback(
    (productId: number) => {
      return favorites.some((p) => p.id === productId);
    },
    [favorites]
  );

  // ----------------------------------------
  // お気に入りをクリア
  // ----------------------------------------
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // ----------------------------------------
  // お気に入り数
  // ----------------------------------------
  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  // ----------------------------------------
  // Context値
  // ----------------------------------------
  const value: FavoritesContextValue = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites,
      favoritesCount,
    }),
    [favorites, addFavorite, removeFavorite, isFavorite, clearFavorites, favoritesCount]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ========================================
// カスタムフック
// ========================================

/**
 * お気に入りコンテキストを使用するカスタムフック
 * @throws FavoritesProvider外で使用された場合にエラー
 */
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}

// デフォルトエクスポート
export default FavoritesContext;
