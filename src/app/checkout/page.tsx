"use client";

// ========================================
// Checkout Page
// ========================================
// 注文確定ページ
// フォーム入力と注文サマリーを表示

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";
import OrderSummary from "@/components/OrderSummary/OrderSummary";
import type { CheckoutFormData, PaymentMethod } from "@/types";
import styles from "./page.module.css";

// 注文番号生成
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();

  // 注文処理の状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");

  // カートが空の場合
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h1 className={styles.emptyCartTitle}>カートが空です</h1>
          <p className={styles.emptyCartText}>
            チェックアウトするには、まず商品をカートに追加してください。
          </p>
          <Link href="/products" className={styles.shopLink}>
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  // 注文完了後
  if (orderComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.successTitle}>ご注文ありがとうございます！</h1>
          <p className={styles.successText}>
            ご注文を承りました。<br />
            確認メールをお送りしましたので、ご確認ください。
          </p>
          <div className={styles.orderNumber}>注文番号: {orderNumber}</div>
          <div>
            <Link href="/" className={styles.homeLink}>
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // フォーム送信ハンドラー
  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);

    // 注文処理のシミュレーション（実際のAPIコールに置き換え可能）
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 注文番号を生成
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);

    // カートをクリア
    clearCart();

    // 注文完了状態に
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {/* 戻るリンク */}
      <Link href="/cart" className={styles.backLink}>
        ← カートに戻る
      </Link>

      {/* ページヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>チェックアウト</h1>
        <p className={styles.subtitle}>お届け先情報を入力してください</p>
      </header>

      {/* メインコンテンツ */}
      <div className={styles.content}>
        {/* フォームセクション */}
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>お届け先情報</h2>
          <CheckoutForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onPaymentMethodChange={setPaymentMethod}
          />
        </section>

        {/* 注文サマリーセクション */}
        <aside className={styles.summarySection}>
          <OrderSummary
            items={cartItems}
            total={totalPrice}
            paymentMethod={paymentMethod}
            isSubmitting={isSubmitting}
          />
        </aside>
      </div>
    </div>
  );
}
