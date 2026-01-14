// ========================================
// Stripe Client-Side Client
// ========================================
// クライアントサイドでStripe.jsを読み込むためのユーティリティ

import { loadStripe, Stripe } from "@stripe/stripe-js";

// シングルトンパターンでStripeインスタンスを保持
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Stripeインスタンスを取得する
 * 初回呼び出し時にのみloadStripeを実行し、以降はキャッシュを返す
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
