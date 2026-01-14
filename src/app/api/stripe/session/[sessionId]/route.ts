// ========================================
// Stripe Session取得API
// ========================================
// Stripe Session IDから決済情報を取得するAPIエンドポイント
// 決済完了後に注文情報を保存するために使用

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { stripe } from "@/lib/stripe";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session IDが必要です" },
        { status: 400 }
      );
    }

    // Stripe Checkout Sessionを取得
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    // 決済が完了していない場合
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "決済が完了していません" },
        { status: 400 }
      );
    }

    // メタデータから情報を取得
    const shippingInfo = checkoutSession.metadata?.shippingInfo
      ? JSON.parse(checkoutSession.metadata.shippingInfo)
      : null;

    // metadataからカート情報を取得 (商品画像URL含む)
    const items = checkoutSession.metadata?.cartItems
      ? JSON.parse(checkoutSession.metadata.cartItems)
      : [];

    // 注文番号生成
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        userId: session.user.id,
        items,
        shippingInfo,
        totalPrice: checkoutSession.amount_total || 0,
        status: "confirmed",
        stripeSessionId: sessionId,
        paymentStatus: checkoutSession.payment_status,
      },
    });
  } catch (error) {
    console.error("Stripe Session取得エラー:", error);
    return NextResponse.json(
      { error: "決済情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
