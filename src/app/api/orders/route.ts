import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { CartItem, CheckoutFormData, SavedOrder } from "@/types";

// ========================================
// 注文 API Routes (Prisma + SQLite)
// ========================================
// 解説: メモリ内 Map から Prisma + SQLite に移行
// - データベースに永続化されるため、サーバー再起動後もデータが残る
// - items と shippingInfo は JSON 文字列として保存

// ========================================
// GET: ユーザーの注文履歴を取得
// ========================================
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 }
      );
    }

    // Prisma でユーザーの注文を取得
    const userId = session.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // 新しい順
    });

    // JSON 文字列をパースして返す
    // 解説: DB には JSON 文字列で保存されているため、
    // クライアントに返す前にオブジェクトに変換
    const parsedOrders: SavedOrder[] = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      items: JSON.parse(order.items) as CartItem[],
      shippingInfo: JSON.parse(order.shippingInfo) as CheckoutFormData,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      status: order.status as SavedOrder["status"],
    }));

    return NextResponse.json({
      success: true,
      data: parsedOrders,
      total: parsedOrders.length,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "注文履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ========================================
// POST: 新規注文を作成
// ========================================
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { id, items, shippingInfo, totalPrice, status } = body;

    // バリデーション
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "カートが空です" },
        { status: 400 }
      );
    }

    if (!shippingInfo) {
      return NextResponse.json(
        { success: false, error: "配送情報が必要です" },
        { status: 400 }
      );
    }

    // Prisma で注文を作成
    // 解説: items と shippingInfo は JSON.stringify でシリアライズして保存
    const order = await prisma.order.create({
      data: {
        id: id || generateOrderId(),
        userId: session.user.id,
        items: JSON.stringify(items),
        shippingInfo: JSON.stringify(shippingInfo),
        totalPrice,
        status: status || "confirmed",
      },
    });

    // レスポンス用にパース
    const savedOrder: SavedOrder = {
      id: order.id,
      userId: order.userId,
      items: JSON.parse(order.items) as CartItem[],
      shippingInfo: JSON.parse(order.shippingInfo) as CheckoutFormData,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      status: order.status as SavedOrder["status"],
    };

    return NextResponse.json({
      success: true,
      data: savedOrder,
      message: "注文が完了しました",
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "注文の作成に失敗しました" },
      { status: 500 }
    );
  }
}

// 注文番号生成ヘルパー
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
