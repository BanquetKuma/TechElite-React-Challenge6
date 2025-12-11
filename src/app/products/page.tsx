"use client";

// ========================================
// Products Page
// ========================================
// 商品一覧ページ
// カテゴリフィルタリングとソート機能付き

import { useState, useMemo } from "react";
import { mockProducts, getAllCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./page.module.css";

// カテゴリ名の日本語マッピング
const categoryLabels: Record<string, string> = {
  all: "すべて",
  clothing: "衣類",
  electronics: "電子機器",
  books: "本",
  food: "食品",
  other: "その他",
};

// ソートオプション
type SortOption = "default" | "price-asc" | "price-desc" | "name";

const sortLabels: Record<SortOption, string> = {
  default: "おすすめ順",
  "price-asc": "価格が安い順",
  "price-desc": "価格が高い順",
  name: "名前順",
};

export default function ProductsPage() {
  // フィルター状態
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // 全カテゴリ取得
  const categories = getAllCategories();

  // フィルタリング・ソート済み商品
  const filteredProducts = useMemo(() => {
    // カテゴリでフィルタリング
    let products =
      selectedCategory === "all"
        ? [...mockProducts]
        : mockProducts.filter(
            (product) => product.category === selectedCategory
          );

    // ソート
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name":
        products.sort((a, b) => a.title.localeCompare(b.title, "ja"));
        break;
      default:
        // おすすめ順（IDの順序を維持）
        break;
    }

    return products;
  }, [selectedCategory, sortBy]);

  // フィルターリセット
  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("default");
  };

  return (
    <div className={styles.container}>
      {/* ページヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>商品一覧</h1>
        <p className={styles.subtitle}>
          高品質な商品を取り揃えております
        </p>
      </header>

      {/* フィルター・ソートセクション */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="category" className={styles.filterLabel}>
            カテゴリ:
          </label>
          <select
            id="category"
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category] || category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="sort" className={styles.filterLabel}>
            並び替え:
          </label>
          <select
            id="sort"
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 商品件数表示 */}
      <p className={styles.resultCount}>
        {filteredProducts.length}件の商品
      </p>

      {/* 商品グリッド */}
      {filteredProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noProducts}>
          <div className={styles.noProductsIcon}>📦</div>
          <h2 className={styles.noProductsTitle}>
            該当する商品がありません
          </h2>
          <p className={styles.noProductsText}>
            フィルター条件を変更してお試しください
          </p>
          <button
            className={styles.resetButton}
            onClick={resetFilters}
          >
            フィルターをリセット
          </button>
        </div>
      )}
    </div>
  );
}
