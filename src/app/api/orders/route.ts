import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { CartItem, CheckoutFormData, SavedOrder } from "@/types";

// ========================================
// 注文 API Routes (Prisma + Supabase)
// ========================================
// 解説: Prisma + Supabase PostgreSQL で注文を管理
// - データベースに永続化されるため、サーバー再起動後もデータが残る
// - items と shippingInfo は JSON 文字列として保存
// - 注文確定時に在庫を減算 (動的在庫管理)

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

    // ========================================
    // DBから最新の在庫をチェック
    // ========================================
    // 解説: カート内の商品IDでDBから最新在庫を取得
    const productIds = items.map((item: CartItem) => item.product.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 在庫チェック (DBの最新在庫と比較)
    const outOfStockItems: { title: string; stock: number; requested: number }[] = [];
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.product.id);
      if (!dbProduct || dbProduct.stock < item.quantity) {
        outOfStockItems.push({
          title: item.product.title,
          stock: dbProduct?.stock || 0,
          requested: item.quantity,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      const errorDetails = outOfStockItems
        .map((item) => `${item.title} (在庫: ${item.stock}, 注文: ${item.requested})`)
        .join(", ");
      return NextResponse.json(
        { success: false, error: `在庫不足の商品があります: ${errorDetails}` },
        { status: 400 }
      );
    }

    // ========================================
    // トランザクションで注文作成 + 在庫減算
    // ========================================
    // 解説: 注文作成と在庫減算を同時に行い、整合性を保つ
    const order = await prisma.$transaction(async (tx) => {
      // 1. 注文を作成
      const newOrder = await tx.order.create({
        data: {
          id: id || generateOrderId(),
          userId: session.user.id,
          items: JSON.stringify(items),
          shippingInfo: JSON.stringify(shippingInfo),
          totalPrice,
          status: status || "confirmed",
        },
      });

      // 2. 各商品の在庫を減算
      for (const item of items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
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
