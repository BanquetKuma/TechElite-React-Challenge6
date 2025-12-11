"use client";

// ========================================
// CartItem Component
// ========================================
// カート内の商品を表示するコンポーネント
// 数量変更・削除機能付き

import Link from "next/link";
import Image from "next/image";
import type { CartItemProps } from "@/types";
import { useCart } from "@/context/CartContext";
import styles from "./CartItem.module.css";

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const { id, title, price, imageUrl } = product;

  // 小計計算
  const subtotal = price * quantity;

  // 価格フォーマット
  const formattedPrice = price.toLocaleString("ja-JP");
  const formattedSubtotal = subtotal.toLocaleString("ja-JP");

  // 数量変更ハンドラー
  const handleIncrease = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  // 削除ハンドラー
  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <article className={styles.item}>
      {/* 商品画像 */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100px"
          className={styles.image}
        />
      </div>

      {/* 商品情報 */}
      <div className={styles.info}>
        <h3 className={styles.title}>
          <Link href={`/products/${id}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>
        <p className={styles.price}>¥{formattedPrice}</p>

        {/* 数量コントロール */}
        <div className={styles.quantityControl}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleDecrease}
            aria-label="数量を減らす"
          >
            −
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleIncrease}
            aria-label="数量を増やす"
          >
            +
          </button>
        </div>
      </div>

      {/* 合計・削除 */}
      <div className={styles.actions}>
        <span className={styles.subtotal}>¥{formattedSubtotal}</span>
        <button
          type="button"
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`${title}を削除`}
        >
          🗑️ 削除
        </button>
      </div>
    </article>
  );
}
