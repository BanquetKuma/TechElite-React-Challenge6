"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import type { CheckoutFormData, CartItem } from "@/types";

// ========================================
// 注文処理の Server Action
// ========================================
// 解説: Server Actions は Next.js 13.4+ の機能
// - "use server" ディレクティブでサーバーサイド実行
// - クライアントから直接呼び出し可能
// - 型安全性を保ちながらフォーム処理

// バリデーション結果の型
type ValidationResult = {
  success: boolean;
  errors?: Partial<Record<keyof CheckoutFormData, string>>;
};

// 注文結果の型
type OrderResult = {
  success: boolean;
  orderId?: string;
  error?: string;
};

// メールアドレスのバリデーション
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 郵便番号のバリデーション
const isValidPostalCode = (code: string): boolean => {
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  return postalCodeRegex.test(code);
};

// ========================================
// フォームバリデーション Action
// ========================================
// 解説: サーバーサイドでのバリデーション
// - クライアント側でもバリデーションするが、セキュリティのため二重チェック
// - 悪意のあるリクエストを防止
export async function validateCheckoutForm(
  formData: CheckoutFormData
): Promise<ValidationResult> {
  const errors: Partial<Record<keyof CheckoutFormData, string>> = {};

  // 名前
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = "お名前を入力してください";
  }

  // メールアドレス
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = "有効なメールアドレスを入力してください";
  }

  // 郵便番号
  if (!formData.postalCode || !isValidPostalCode(formData.postalCode)) {
    errors.postalCode = "郵便番号を正しく入力してください (例: 123-4567)";
  }

  // 市区町村
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = "市区町村を入力してください";
  }

  // 住所
  if (!formData.address || formData.address.trim().length < 5) {
    errors.address = "住所を入力してください";
  }

  // 支払い方法
  if (!["credit", "bank", "cod"].includes(formData.paymentMethod)) {
    errors.paymentMethod = "支払い方法を選択してください";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

// ========================================
// 注文作成 Action
// ========================================
// 解説: 注文処理のメイン関数
// 1. セッション確認
// 2. バリデーション
// 3. 注文ID生成
// 4. (本番では) DB保存、メール送信
export async function createOrder(
  formData: CheckoutFormData,
  items: CartItem[],
  totalPrice: number
): Promise<OrderResult> {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);

    // バリデーション
    const validation = await validateCheckoutForm(formData);
    if (!validation.success) {
      return {
        success: false,
        error: "入力内容に誤りがあります",
      };
    }

    // カート確認
    if (!items || items.length === 0) {
      return {
        success: false,
        error: "カートが空です",
      };
    }

    // 在庫確認
    const outOfStockItems = items.filter(item => item.product.stock < item.quantity);
    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(item => item.product.title).join(", ");
      return { success: false, error: `在庫切れの商品があります: ${itemNames}` };
    }

    // 注文ID生成
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // 注文データの保存 (本番ではDBに保存)
    // await db.orders.create({
    //   data: {
    //     id: orderId,
    //     userId: session?.user?.id,
    //     items,
    //     shippingInfo: formData,
    //     totalPrice,
    //     status: "confirmed",
    //   },
    // });

    // 確認メール送信 (本番では実装)
    // await sendOrderConfirmationEmail(formData.email, orderId);

    // 成功
    return {
      success: true,
      orderId,
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      error: "注文処理中にエラーが発生しました",
    };
  }
}
