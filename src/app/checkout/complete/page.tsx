"use client";

// ========================================
// Checkout Complete Page
// ========================================
// Stripe決済完了後のリダイレクト先ページ
// session_id パラメータを受け取り、決済成功を表示
// 注文情報をDBに保存して購入履歴に反映

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import styles from "../page.module.css";

// ----------------------------------------
// ローディングコンポーネント
// ----------------------------------------
function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>...</div>
        <h1 className={styles.successTitle}>読み込み中</h1>
        <p className={styles.successText}>
          しばらくお待ちください...
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------
// 決済完了コンテンツコンポーネント
// ----------------------------------------
// useSearchParams()を使用するためSuspense内で呼び出す
function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session } = useSession();
  const { clearCart } = useCart();
  const { addOrder, fetchOrders } = useOrders();

  const [isProcessed, setIsProcessed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Stripe決済成功時: Session情報取得 → 注文保存 → カートクリア
  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId || isProcessed) {
        setIsLoading(false);
        return;
      }

      try {
        // Stripe Session情報を取得
        const response = await fetch(`/api/stripe/session/${sessionId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          // 既に処理済みの場合はエラーにしない
          if (data.error === "決済情報の取得に失敗しました") {
            // セッション既処理の可能性があるため、履歴を取得して確認
            await fetchOrders();
          }
          setError(data.error || "注文情報の取得に失敗しました");
          setIsLoading(false);
          return;
        }

        const orderData = data.data;
        setOrderNumber(orderData.orderId);

        // 注文をDBに保存 (OrderContext経由)
        if (session?.user) {
          addOrder({
            id: orderData.orderId,
            userId: session.user.id,
            items: orderData.items,
            shippingInfo: orderData.shippingInfo,
            totalPrice: orderData.totalPrice,
            status: "confirmed",
          });
        }

        // カートをクリア
        clearCart();
        setIsProcessed(true);
        setIsLoading(false);
      } catch (err) {
        console.error("注文処理エラー:", err);
        setError("注文処理中にエラーが発生しました");
        setIsLoading(false);
      }
    };

    processOrder();
  }, [sessionId, isProcessed, session, addOrder, clearCart, fetchOrders]);

  // session_id がない場合は通常のチェックアウトにリダイレクト
  if (!sessionId) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>?</div>
          <h1 className={styles.emptyCartTitle}>ページが見つかりません</h1>
          <p className={styles.emptyCartText}>
            このページは決済完了後にのみアクセスできます。
          </p>
          <Link href="/products" className={styles.shopLink}>
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>...</div>
          <h1 className={styles.successTitle}>注文を処理中です</h1>
          <p className={styles.successText}>
            しばらくお待ちください...
          </p>
        </div>
      </div>
    );
  }

  // エラー表示 (ただし決済自体は成功している可能性がある)
  if (error && !isProcessed) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>!</div>
          <h1 className={styles.successTitle}>決済は完了しました</h1>
          <p className={styles.successText}>
            決済は正常に完了しましたが、注文情報の保存で問題が発生しました。
            <br />
            購入履歴に反映されない場合は、お問い合わせください。
          </p>
          <div className={styles.orderInfo}>
            <p>決済セッションID:</p>
            <code className={styles.sessionId}>
              {sessionId.substring(0, 20)}...
            </code>
          </div>
          <div className={styles.successActions}>
            <Link href="/" className={styles.homeLink}>
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>&#127881;</div>
        <h1 className={styles.successTitle}>ご注文ありがとうございます!</h1>
        <p className={styles.successText}>
          クレジットカード決済が正常に完了しました。
          <br />
          確認メールをお送りしましたので、ご確認ください。
        </p>
        {orderNumber && (
          <div className={styles.orderNumber}>注文番号: {orderNumber}</div>
        )}
        <div className={styles.orderInfo}>
          <p>決済セッションID:</p>
          <code className={styles.sessionId}>
            {sessionId.substring(0, 20)}...
          </code>
        </div>
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

// ----------------------------------------
// ページコンポーネント
// ----------------------------------------
// Suspenseでラップしてビルドエラーを回避
export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutCompleteContent />
    </Suspense>
  );
}
