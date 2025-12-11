"use client";

// ========================================
// Cart Page
// ========================================
// カートページ
// カート内の商品一覧と注文サマリーを表示

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem/CartItem";
import styles from "./page.module.css";

// 送料の設定（一定金額以上で無料）
const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 500;

export default function CartPage() {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();

  // 送料計算
  const shippingFee = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // 総合計
  const grandTotal = totalPrice + shippingFee;

  // 価格フォーマット
  const formattedSubtotal = totalPrice.toLocaleString("ja-JP");
  const formattedShipping =
    shippingFee === 0 ? "無料" : `¥${shippingFee.toLocaleString("ja-JP")}`;
  const formattedTotal = grandTotal.toLocaleString("ja-JP");
  const freeShippingRemaining = FREE_SHIPPING_THRESHOLD - totalPrice;

  // カートが空の場合
  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h1 className={styles.emptyCartTitle}>カートは空です</h1>
          <p className={styles.emptyCartText}>
            まだ商品がカートに入っていません。
            <br />
            素敵な商品を見つけてカートに追加しましょう。
          </p>
          <Link href="/products" className={styles.shopLink}>
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ページヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>ショッピングカート</h1>
        <p className={styles.itemCount}>{totalItems}点の商品</p>
      </header>

      {/* メインコンテンツ */}
      <div className={styles.content}>
        {/* カートアイテムリスト */}
        <div className={styles.itemList}>
          {cartItems.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        {/* 注文サマリー */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>注文サマリー</h2>

          {/* 小計 */}
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>小計</span>
            <span className={styles.summaryValue}>¥{formattedSubtotal}</span>
          </div>

          {/* 送料 */}
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>送料</span>
            <span className={styles.summaryValue}>{formattedShipping}</span>
          </div>

          {/* 送料無料まであと少し */}
          {shippingFee > 0 && (
            <p className={styles.summaryRow} style={{ color: "var(--color-primary)", fontSize: "var(--font-size-xs)" }}>
              あと¥{freeShippingRemaining.toLocaleString("ja-JP")}で送料無料
            </p>
          )}

          <div className={styles.summaryDivider} />

          {/* 合計 */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>合計（税込）</span>
            <span className={styles.totalValue}>¥{formattedTotal}</span>
          </div>

          {/* 購入ボタン */}
          <Link href="/checkout" className={styles.checkoutButton}>
            レジに進む
          </Link>

          {/* 買い物を続ける */}
          <Link href="/products" className={styles.continueShoppingLink}>
            買い物を続ける
          </Link>

          {/* カートをクリア */}
          <button
            type="button"
            className={styles.clearCartButton}
            onClick={clearCart}
          >
            カートを空にする
          </button>
        </aside>
      </div>
    </div>
  );
}
