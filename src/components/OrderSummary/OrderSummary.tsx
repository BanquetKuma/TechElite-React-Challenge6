"use client";

// ========================================
// OrderSummary Component
// ========================================
// 注文内容サマリーコンポーネント
// カート内容と合計金額を表示

import Image from "next/image";
import type { OrderSummaryProps } from "@/types";
import styles from "./OrderSummary.module.css";

// 送料の設定
const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 500;
const COD_FEE = 330; // 代金引換手数料

export default function OrderSummary({ items, total, paymentMethod, isSubmitting }: OrderSummaryProps) {
  // 送料計算
  const shippingFee = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  // 代金引換手数料
  const codFee = paymentMethod === "cod" ? COD_FEE : 0;
  const grandTotal = total + shippingFee + codFee;

  // 価格フォーマット
  const formattedSubtotal = total.toLocaleString("ja-JP");
  const formattedShipping =
    shippingFee === 0 ? "無料" : `¥${shippingFee.toLocaleString("ja-JP")}`;
  const formattedTotal = grandTotal.toLocaleString("ja-JP");

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>注文内容</h2>

      {/* 商品リスト */}
      <div className={styles.itemList}>
        {items.map((item) => {
          const { product, quantity } = item;
          const itemTotal = product.price * quantity;
          const formattedItemTotal = itemTotal.toLocaleString("ja-JP");

          return (
            <div key={product.id} className={styles.item}>
              <div className={styles.itemImage}>
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="60px"
                  className={styles.image}
                />
              </div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{product.title}</h3>
                <div className={styles.itemMeta}>
                  <span className={styles.itemQuantity}>数量: {quantity}</span>
                  <span className={styles.itemPrice}>¥{formattedItemTotal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 金額サマリー */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>小計</span>
          <span className={styles.summaryValue}>¥{formattedSubtotal}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>送料</span>
          <span className={styles.summaryValue}>{formattedShipping}</span>
        </div>
        {codFee > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>代金引換手数料</span>
            <span className={styles.summaryValue}>¥{codFee.toLocaleString("ja-JP")}</span>
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>合計（税込）</span>
          <span className={styles.totalValue}>¥{formattedTotal}</span>
        </div>
      </div>

      {/* 注意書き */}
      <p className={styles.note}>
        ※ ¥{FREE_SHIPPING_THRESHOLD.toLocaleString("ja-JP")}以上のご注文で送料無料
        <br />
        ※ 消費税込みの金額です
      </p>

      {/* 注文確定ボタン */}
      <button
        type="submit"
        form="checkout-form"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "処理中..." : "注文を確定"}
      </button>
    </aside>
  );
}
