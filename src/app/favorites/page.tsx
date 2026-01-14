"use client";

// ========================================
// Favorites Page
// ========================================
// お気に入り商品一覧ページ
// LocalStorageに保存されたお気に入り商品を表示

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();

  return (
    <div className={styles.container}>
      {/* ページヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>お気に入り</h1>
        <p className={styles.subtitle}>
          {favoritesCount > 0
            ? `${favoritesCount}件の商品がお気に入りに登録されています`
            : "お気に入り商品はありません"}
        </p>
      </header>

      {/* お気に入り商品一覧 */}
      {favorites.length > 0 ? (
        <>
          {/* アクションボタン */}
          <div className={styles.actions}>
            <button
              className={styles.clearButton}
              onClick={clearFavorites}
            >
              すべて削除
            </button>
          </div>

          {/* 商品グリッド */}
          <div className={styles.productGrid}>
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>♡</div>
          <h2 className={styles.emptyTitle}>
            お気に入り商品がありません
          </h2>
          <p className={styles.emptyText}>
            商品ページでハートアイコンをクリックして、
            お気に入りに追加しましょう
          </p>
          <Link href="/products" className={styles.browseButton}>
            商品を見る
          </Link>
        </div>
      )}
    </div>
  );
}
