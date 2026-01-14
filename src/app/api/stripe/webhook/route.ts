// ========================================
// Stripe Webhook Handler
// ========================================
// Stripeからのイベント通知を処理するWebhookエンドポイント
// checkout.session.completed: 決済完了時に注文をDBに保存

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Webhook署名を検証
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // checkout.session.completed イベント処理
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // メタデータから情報取得
      const userId = session.metadata?.userId;
      const shippingInfo = session.metadata?.shippingInfo || "{}";

      if (!userId) {
        console.error("Missing userId in session metadata");
        return NextResponse.json(
          { error: "Missing userId" },
          { status: 400 }
        );
      }

      // 注文ID生成
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // line_items 取得
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // 注文データ整形
      const items = lineItems.data.map((item) => ({
        product: {
          id: 0,
          title: item.description || "商品",
          price: item.price?.unit_amount || 0,
          description: "",
          imageUrl: "",
          category: "other" as const,
          stock: 0,
        },
        quantity: item.quantity || 1,
      }));

      // 注文をDBに保存
      await prisma.order.create({
        data: {
          id: orderId,
          userId: userId,
          items: JSON.stringify(items),
          shippingInfo: shippingInfo,
          totalPrice: session.amount_total || 0,
          status: "confirmed",
        },
      });

      console.log(`Order created via Stripe webhook: ${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
