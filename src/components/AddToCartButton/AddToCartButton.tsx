"use client";

// ========================================
// AddToCartButton Component
// ========================================
// カートに商品を追加するボタンコンポーネント
// クリック時にフィードバックを表示

import { useState } from "react";
import type { AddToCartButtonProps } from "@/types";
import { useCart } from "@/context/CartContext";
import styles from "./AddToCartButton.module.css";

type ButtonVariant = "default" | "compact" | "fullWidth";

interface ExtendedAddToCartButtonProps extends AddToCartButtonProps {
  variant?: ButtonVariant;
}

export default function AddToCartButton({
  product,
  disabled = false,
  variant = "default",
}: ExtendedAddToCartButtonProps) {
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // 在庫切れチェック
  const isOutOfStock = product.stock === 0;
  const isDisabled = disabled || isOutOfStock;

  // カートに追加ハンドラー
  const handleAddToCart = () => {
    if (isDisabled) return;

    addItem(product);
    setShowSuccess(true);

    // 2秒後に成功表示をリセット
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  // ボタンクラスの構築
  const buttonClasses = [
    styles.button,
    showSuccess && styles.success,
    variant === "compact" && styles.compact,
    variant === "fullWidth" && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(" ");

  // ボタンテキスト
  const buttonText = showSuccess
    ? "追加しました"
    : isOutOfStock
    ? "在庫切れ"
    : "カートに追加";

  // アイコン
  const icon = showSuccess ? "✓" : isOutOfStock ? "✕" : "🛒";

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleAddToCart}
      disabled={isDisabled}
      aria-label={`${product.title}をカートに追加`}
    >
      <span className={styles.icon}>{icon}</span>
      {buttonText}
    </button>
  );
}
