// ========================================
// Stripe Server-Side Client
// ========================================
// サーバーサイドでStripe APIを呼び出すためのクライアント

import Stripe from "stripe";

// シークレットキーでStripeインスタンスを作成
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
