"use client";

// ========================================
// Order Context
// ========================================
// 注文履歴を管理するContext
// 解説: Context API を使用して、アプリ全体で注文データを共有
// - 複数のページから注文履歴にアクセス可能
// - チェックアウト完了時に注文を追加
// - 購入履歴ページで注文一覧を表示

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import type { SavedOrder, OrderContextValue } from "@/types";

// ========================================
// Context作成
// ========================================
// 解説: createContext で Context オブジェクトを作成
// null を初期値として、Provider の外で使用された場合をエラーハンドリング
const OrderContext = createContext<OrderContextValue | null>(null);

// ========================================
// Provider実装
// ========================================
type OrderProviderProps = {
  children: ReactNode;
};

// 注文ID生成関数
// 解説: タイムスタンプとランダム文字列を組み合わせてユニークなIDを生成
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export function OrderProvider({ children }: OrderProviderProps) {
  // 認証情報を取得
  const { data: session } = useSession();

  // 注文履歴の状態
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------
  // 注文履歴を取得（API経由）
  // ----------------------------------------
  // 解説: useCallback でメモ化
  // - 依存配列に session を指定
  // - session が変わった時だけ関数を再作成
  // - useEffect の依存配列に安全に入れられる
  const fetchOrders = useCallback(async () => {
    // 未認証の場合は取得しない
    if (!session?.user) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      // エラー発生時はコンソールに出力
      // 解説: エラーでもUIは動き続ける（グレースフルデグラデーション）
      console.error("Failed to fetch orders:", error);
    } finally {
      // 解説: finally は成功・失敗に関わらず必ず実行される
      // ローディング状態を必ず解除することで、UIが固まるのを防ぐ
      setIsLoading(false);
    }
  }, [session]);

  // ----------------------------------------
  // 注文を追加
  // ----------------------------------------
  // 解説: ハイブリッド戦略
  // 1. まずContext (メモリ) に保存 → UIを即時更新
  // 2. バックグラウンドでAPIに送信 → Prisma で DB 永続化
  // 注意: id は Server Action から渡される (一貫性のため)
  const addOrder = useCallback(
    (orderData: Omit<SavedOrder, "createdAt">): SavedOrder => {
      // 新しい注文オブジェクトを作成
      // 解説: id は Server Action から渡される、createdAt は現在時刻
      const newOrder: SavedOrder = {
        ...orderData,
        createdAt: new Date().toISOString(),
      };

      // Contextの状態を更新 (即時反映)
      // 解説: 関数形式で更新することで、最新の状態を確実に取得
      setOrders((prev) => [newOrder, ...prev]);

      // APIにも保存 (バックグラウンドで Prisma 経由で DB に保存)
      // 解説: await しないことで、UIをブロックしない
      // catch でエラーをログに出力 (失敗してもUIは動く)
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch(console.error);

      return newOrder;
    },
    []
  );

  // ----------------------------------------
  // Context値
  // ----------------------------------------
  const value: OrderContextValue = {
    orders,
    addOrder,
    fetchOrders,
    isLoading,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

// ========================================
// カスタムフック
// ========================================
// 解説: Context を使いやすくするためのカスタムフック
// - Provider の外で使用された場合はエラーを投げる
// - 型安全性を保証（null チェック不要）
export function useOrders(): OrderContextValue {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }

  return context;
}

export default OrderContext;
