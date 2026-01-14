"use client";

// ========================================
// ProductCard Component
// ========================================
// 商品カードコンポーネント
// 商品一覧ページで各商品を表示するためのカード

import Link from "next/link";
import Image from "next/image";
import type { ProductCardProps } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./ProductCard.module.css";

// カテゴリ名の日本語マッピング
const categoryLabels: Record<string, string> = {
  clothing: "衣類",
  electronics: "電子機器",
  books: "本",
  food: "食品",
  other: "その他",
};

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    title,
    price,
    description,
    imageUrl,
    category,
    stock,
  } = product;

  // お気に入り機能
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isProductFavorite = isFavorite(id);

  // お気に入りトグル
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Linkへの伝播を防ぐ
    e.stopPropagation();
    if (isProductFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(product);
    }
  };

  // 在庫状況の判定
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // 価格のフォーマット（3桁区切り）
  const formattedPrice = price.toLocaleString("ja-JP");

  // カテゴリの日本語ラベル取得
  const categoryLabel = categoryLabels[category] || category;

  return (
    <article
      className={`${styles.card} ${isOutOfStock ? styles.disabled : ""}`}
    >
      {/* 商品画像 */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
        {/* お気に入りボタン */}
        <button
          className={`${styles.favoriteButton} ${isProductFavorite ? styles.favoriteActive : ""}`}
          onClick={handleFavoriteClick}
          aria-label={isProductFavorite ? "お気に入りから削除" : "お気に入りに追加"}
        >
          {isProductFavorite ? "♥" : "♡"}
        </button>
        {/* カテゴリバッジ */}
        <span className={styles.category}>{categoryLabel}</span>
        {/* 在庫切れバッジ */}
        {isOutOfStock && (
          <span className={styles.outOfStock}>在庫切れ</span>
        )}
      </div>

      {/* 商品情報 */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {/* 価格と在庫情報 */}
        <div className={styles.priceContainer}>
          <span className={styles.price}>¥{formattedPrice}</span>
          <span
            className={`${styles.stock} ${isLowStock ? styles.stockLow : ""}`}
          >
            {isOutOfStock
              ? "在庫なし"
              : isLowStock
              ? `残り${stock}点`
              : `在庫あり`}
          </span>
        </div>

        {/* 商品詳細リンク */}
        {isOutOfStock ? (
          <span className={styles.detailLink}>在庫切れ</span>
        ) : (
          <Link href={`/products/${id}`} className={styles.detailLink}>
            商品を見る
          </Link>
        )}
      </div>
    </article>
  );
}
