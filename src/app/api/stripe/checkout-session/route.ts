// ========================================
// Stripe Checkout Session API
// ========================================
// Stripe Checkout Sessionを作成するAPIエンドポイント

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // リクエストボディ取得
    const { items, shippingInfo } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "カートが空です" },
        { status: 400 }
      );
    }

    // Stripe line_items 作成
    // 注意: images は絶対URL (http/https) のみ受け付ける
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.product.title,
          description: item.product.description?.substring(0, 500),
          // 相対パスの場合は images を省略 (Stripeは絶対URLのみ対応)
          images: item.product.imageUrl?.startsWith("http")
            ? [item.product.imageUrl]
            : undefined,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    // 小計計算
    const subtotal = items.reduce(
      (sum: number, item: CartItem) =>
        sum + item.product.price * item.quantity,
      0
    );

    // 送料計算 (10,000円以上で無料、それ以外は500円)
    const shippingFee = subtotal >= 10000 ? 0 : 500;

    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "jpy",
          product_data: {
            name: "送料",
            description: "配送料金",
          },
          unit_amount: shippingFee,
        },
        quantity: 1,
      });
    }

    // Checkout Session 作成
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id || session.user.email,
        shippingInfo: JSON.stringify(shippingInfo),
        cartItems: JSON.stringify(items),
      },
      // 日本語ロケール
      locale: "ja",
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
