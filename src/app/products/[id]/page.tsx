"use client";

// ========================================
// Product Detail Page
// ========================================
// 商品詳細ページ
// 動的ルーティングで商品IDを取得

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById } from "@/data/products";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

// カテゴリ名の日本語マッピング
const categoryLabels: Record<string, string> = {
  clothing: "衣類",
  electronics: "電子機器",
  books: "本",
  food: "食品",
  other: "その他",
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();

  // URLパラメータから商品IDを取得
  const productId = Number(params.id);

  // 商品データを取得
  const product = useMemo(() => getProductById(productId), [productId]);

  // 数量の状態
  const [quantity, setQuantity] = useState(1);

  // カートに追加成功のフィードバック
  const [showFeedback, setShowFeedback] = useState(false);

  // 商品が見つからない場合
  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>📦</div>
          <h1 className={styles.notFoundTitle}>商品が見つかりません</h1>
          <p className={styles.notFoundText}>
            お探しの商品は存在しないか、削除された可能性があります。
          </p>
          <Link href="/products" className={styles.backLink}>
            商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    price,
    description,
    imageUrl,
    category,
    stock,
  } = product;

  // 在庫状況
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // カテゴリラベル
  const categoryLabel = categoryLabels[category] || category;

  // 価格フォーマット
  const formattedPrice = price.toLocaleString("ja-JP");

  // 数量変更ハンドラー
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  // カートに追加ハンドラー
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
    setQuantity(1);
  };

  return (
    <div className={styles.container}>
      {/* パンくずリスト */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          ホーム
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/products" className={styles.breadcrumbLink}>
          商品一覧
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{title}</span>
      </nav>

      {/* 商品詳細 */}
      <div className={styles.productDetail}>
        {/* 画像セクション */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
            <span className={styles.categoryBadge}>{categoryLabel}</span>
            {isOutOfStock && (
              <span className={styles.outOfStockBadge}>在庫切れ</span>
            )}
          </div>
        </div>

        {/* 情報セクション */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.price}>
            ¥{formattedPrice}
            <span className={styles.priceLabel}>（税込）</span>
          </div>

          <p className={styles.description}>{description}</p>

          {/* 在庫情報 */}
          <div className={styles.stockInfo}>
            <span className={styles.stockIcon}>
              {isOutOfStock ? "❌" : isLowStock ? "⚠️" : "✅"}
            </span>
            <span
              className={`${styles.stockText} ${
                isOutOfStock
                  ? styles.stockOut
                  : isLowStock
                  ? styles.stockLow
                  : styles.stockAvailable
              }`}
            >
              {isOutOfStock
                ? "現在在庫切れです"
                : isLowStock
                ? `残り${stock}点のみ`
                : `在庫あり（${stock}点）`}
            </span>
          </div>

          {/* 数量選択 */}
          {!isOutOfStock && (
            <div className={styles.quantitySection}>
              <label className={styles.quantityLabel}>数量:</label>
              <div className={styles.quantityControl}>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="数量を減らす"
                >
                  −
                </button>
                <input
                  type="number"
                  className={styles.quantityInput}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(Number(e.target.value))
                  }
                  min={1}
                  max={stock}
                  aria-label="数量"
                />
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stock}
                  aria-label="数量を増やす"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* カートに追加ボタン */}
          <button
            type="button"
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {showFeedback
              ? "✓ カートに追加しました"
              : isOutOfStock
              ? "在庫切れ"
              : "カートに追加"}
          </button>
        </div>
      </div>
    </div>
  );
}
