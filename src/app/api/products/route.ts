import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// GET: 商品一覧を取得 (Prisma経由)
// ========================================
// 変更点: mockProducts -> prisma.product.findMany()
// DBから最新の在庫情報を含む商品データを取得
export async function GET(request: NextRequest) {
  try {
    // URL からクエリパラメータを取得
    // 例: /api/products?category=clothing&search=シャツ
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // "clothing"
    const search = searchParams.get("search"); // "シャツ"

    // Prisma でDBから商品を取得
    let products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    // カテゴリでフィルタリング
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    // 検索ワードでフィルタリング
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // 成功レスポンス（ステータス 200 は省略可能）
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    // エラーレスポンス（500 = サーバーエラー）
    return NextResponse.json(
      { success: false, error: "商品の取得に失敗しました" },
      { status: 500 }
    );
  }
}
