"use client";

// ========================================
// Order History Page
// ========================================
// 購入履歴ページ
// 解説: ログインユーザーの過去の注文履歴を表示
// - OrderContext から注文データを取得
// - 未ログインユーザーはミドルウェアでリダイレクト済み

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useOrders } from "@/context/OrderContext";
import styles from "./page.module.css";

// ステータスラベル変換関数
// 解説: 英語のステータスを日本語に変換
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "処理中",
    confirmed: "確定",
    shipped: "発送済み",
    delivered: "配達完了",
    cancelled: "キャンセル",
  };
  return labels[status] || status;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const { orders, fetchOrders, isLoading } = useOrders();
  const router = useRouter();

  // ----------------------------------------
  // 認証チェック
  // ----------------------------------------
  // 解説: クライアント側でも認証状態を確認
  // ミドルウェアで保護されているが、二重チェックで安全性を高める
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/user/orders");
    }
  }, [status, router]);

  // ----------------------------------------
  // 注文履歴を取得
  // ----------------------------------------
  // 解説: セッションが確立されたらAPIから注文履歴を取得
  // fetchOrders は useCallback でメモ化されているので、
  // 依存配列に入れても無限ループしない
  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session, fetchOrders]);

  // ローディング中の表示
  if (status === "loading" || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト待ち）
  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* ページヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>購入履歴</h1>
        <p className={styles.subtitle}>{session.user?.name} さんの注文一覧</p>
      </header>

      {/* 注文がない場合 */}
      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>購入履歴がありません</h2>
          <p>商品を購入すると、ここに履歴が表示されます。</p>
          <Link href="/products" className={styles.shopLink}>
            商品を探す
          </Link>
        </div>
      ) : (
        // 注文一覧
        <div className={styles.orderList}>
          {orders.map((order) => (
            <article key={order.id} className={styles.orderCard}>
              {/* 注文ヘッダー */}
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>注文番号: {order.id}</span>
                  <time className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <span className={`${styles.status} ${styles[order.status]}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* 注文商品一覧 */}
              <div className={styles.orderItems}>
                {order.items.map((item) => (
                  <div key={item.product.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.product.title}</h4>
                      <p>
                        ¥{item.product.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 注文フッター */}
              <div className={styles.orderFooter}>
                <div className={styles.shippingInfo}>
                  <strong>配送先:</strong>
                  <span>
                    〒{order.shippingInfo.postalCode} {order.shippingInfo.city}{" "}
                    {order.shippingInfo.address}
                  </span>
                </div>
                <div className={styles.orderTotal}>
                  <span>合計</span>
                  <strong>¥{order.totalPrice.toLocaleString()}</strong>
                </div>
              </div>
            </article>
          ))}
          {/* 全注文の合計金額 */}
          <div className={styles.grandTotal}>
            <span className={styles.grandTotalLabel}>
              全{orders.length}件の購入合計
            </span>
            <span className={styles.grandTotalAmount}>
              ¥{orders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* トップページへのリンク */}
      <Link href="/" className={styles.backLink}>
        ← トップページへ戻る
      </Link>
    </div>
  );
}
