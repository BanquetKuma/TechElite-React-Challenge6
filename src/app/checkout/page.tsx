"use client";

// ========================================
// Checkout Page
// ========================================
// 注文確定ページ (マルチステップフォーム)
// 解説: Server Actions を活用した3ステップの購入フロー
// Step 1: 配送先情報入力
// Step 2: 注文内容確認
// Step 3: 注文完了

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { validateCheckoutForm, createOrder } from "./actions";
import { getStripe } from "@/lib/stripe-client";
import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";
import OrderSummary from "@/components/OrderSummary/OrderSummary";
import type { CheckoutFormData, PaymentMethod } from "@/types";
import styles from "./page.module.css";

// ========================================
// ステップ定義
// ========================================
// 解説: Union型でステップを明示的に定義
// - "form": 入力画面
// - "confirm": 確認画面
// - "complete": 完了画面
type CheckoutStep = "form" | "confirm" | "complete";

// ----------------------------------------
// ローディングコンポーネント
// ----------------------------------------
function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartIcon}>...</div>
        <h1 className={styles.emptyCartTitle}>読み込み中</h1>
        <p className={styles.emptyCartText}>
          しばらくお待ちください...
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------
// チェックアウトコンテンツコンポーネント
// ----------------------------------------
// useSearchParams()を使用するためSuspense内で呼び出す
function CheckoutContent() {
  const { data: session } = useSession();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const searchParams = useSearchParams();

  // ----------------------------------------
  // State管理
  // ----------------------------------------
  // 解説: 関心の分離 (Separation of Concerns)
  // - currentStep: どのステップか
  // - formData: ユーザー入力データ
  // - paymentMethod: 支払い方法
  // - isSubmitting: 処理中かどうか
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("form");
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  // Stripeからのキャンセルリダイレクト処理
  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      setError("決済がキャンセルされました。再度お試しください。");
    }
  }, [searchParams]);

  // カートが空の場合
  if (cartItems.length === 0 && currentStep !== "complete") {
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

  // ========================================
  // Step 1: フォーム送信 (確認画面へ)
  // ========================================
  // 解説: Server Actions でバリデーション
  // - クライアント側でも検証済みだが、セキュリティのため二重チェック
  // - 成功時のみ formData に保存して次のステップへ
  const handleFormSubmit = async (data: CheckoutFormData) => {
    setError("");
    setIsSubmitting(true);

    // Server Action でバリデーション
    const validation = await validateCheckoutForm(data);

    setIsSubmitting(false);

    if (!validation.success) {
      setError("入力内容を確認してください");
      return;
    }

    setFormData(data);
    setCurrentStep("confirm");
  };

  // ========================================
  // Step 2: 注文確定
  // ========================================
  // 解説: Server Actions で注文処理
  // クレジットカードの場合: Stripe Checkoutにリダイレクト
  // 銀行振込・代金引換の場合: 従来の処理
  const handleConfirmOrder = async () => {
    if (!formData) return;

    setError("");
    setIsSubmitting(true);

    // ----------------------------------------
    // クレジットカードの場合: Stripe Checkout
    // ----------------------------------------
    if (formData.paymentMethod === "credit") {
      try {
        // Stripe Checkout Session作成
        const response = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            shippingInfo: formData,
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setIsSubmitting(false);
          return;
        }

        // Stripe Checkoutページにリダイレクト (URL直接リダイレクト)
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("決済URLの取得に失敗しました");
          setIsSubmitting(false);
        }
        return;
      } catch (err) {
        console.error("Stripe error:", err);
        setError("決済処理でエラーが発生しました");
        setIsSubmitting(false);
        return;
      }
    }

    // ----------------------------------------
    // 銀行振込・代金引換の場合: 従来の処理
    // ----------------------------------------
    // Server Action で注文作成
    const result = await createOrder(formData, cartItems, totalPrice);

    if (!result.success) {
      setError(result.error || "注文処理に失敗しました");
      setIsSubmitting(false);
      return;
    }

    setOrderNumber(result.orderId!);

    // 注文履歴に保存 (ログイン時)
    if (session?.user) {
      addOrder({
        id: result.orderId!,
        userId: session.user.id,
        items: cartItems,
        shippingInfo: formData,
        totalPrice,
        status: "confirmed",
      });
    }

    // カートをクリア
    clearCart();

    // 完了画面へ
    setCurrentStep("complete");
    setIsSubmitting(false);
  };

  // ========================================
  // Step 2: 戻る
  // ========================================
  // 解説: データは保持したまま入力画面に戻る
  const handleBackToForm = () => {
    setCurrentStep("form");
    setError("");
  };

  // ========================================
  // レンダリング
  // ========================================

  // Step 3: 完了画面
  if (currentStep === "complete") {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.successTitle}>ご注文ありがとうございます!</h1>
          <p className={styles.successText}>
            ご注文を承りました。
            <br />
            確認メールをお送りしましたので、ご確認ください。
          </p>
          <div className={styles.orderNumber}>注文番号: {orderNumber}</div>
          <div className={styles.successActions}>
            {session && (
              <Link href="/user/orders" className={styles.ordersLink}>
                購入履歴を見る
              </Link>
            )}
            <Link href="/" className={styles.homeLink}>
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: 確認画面
  if (currentStep === "confirm" && formData) {
    return (
      <div className={styles.container}>
        {/* ステップインジケーター */}
        <div className={styles.stepIndicator}>
          <span className={styles.stepComplete}>1. 入力</span>
          <span className={styles.stepCurrent}>2. 確認</span>
          <span className={styles.stepPending}>3. 完了</span>
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>注文内容の確認</h1>
          <p className={styles.subtitle}>以下の内容でよろしいですか?</p>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.confirmContent}>
          {/* 配送先情報 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>お届け先</h2>
            <div className={styles.confirmInfo}>
              <p>
                <strong>{formData.name}</strong> 様
              </p>
              <p>〒{formData.postalCode}</p>
              <p>
                {formData.city} {formData.address}
              </p>
              <p>{formData.email}</p>
            </div>
          </section>

          {/* 支払い方法 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>お支払い方法</h2>
            <p className={styles.confirmInfo}>
              {formData.paymentMethod === "credit" && "クレジットカード"}
              {formData.paymentMethod === "bank" && "銀行振込"}
              {formData.paymentMethod === "cod" && "代金引換"}
            </p>
          </section>

          {/* 注文サマリー */}
          <OrderSummary
            items={cartItems}
            total={totalPrice}
            paymentMethod={formData.paymentMethod}
            isSubmitting={isSubmitting}
            showSubmitButton={false}
          />
        </div>

        <div className={styles.confirmActions}>
          <button
            type="button"
            onClick={handleBackToForm}
            className={styles.backButton}
            disabled={isSubmitting}
          >
            ← 修正する
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            className={styles.confirmButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "注文処理中..." : "注文を確定する"}
          </button>
        </div>
      </div>
    );
  }

  // Step 1: 入力画面
  return (
    <div className={styles.container}>
      {/* ステップインジケーター */}
      <div className={styles.stepIndicator}>
        <span className={styles.stepCurrent}>1. 入力</span>
        <span className={styles.stepPending}>2. 確認</span>
        <span className={styles.stepPending}>3. 完了</span>
      </div>

      <Link href="/cart" className={styles.backLink}>
        ← カートに戻る
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>チェックアウト</h1>
        <p className={styles.subtitle}>お届け先情報を入力してください</p>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.content}>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>お届け先情報</h2>
          <CheckoutForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onPaymentMethodChange={setPaymentMethod}
            defaultValues={formData || undefined}
          />
        </section>

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

// ----------------------------------------
// ページコンポーネント
// ----------------------------------------
// Suspenseでラップしてビルドエラーを回避
export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutContent />
    </Suspense>
  );
}
