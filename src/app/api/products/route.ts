import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";

// ========================================
// GET: 商品一覧を取得
// ========================================
// なぜ GET？→ データを「取得」するだけで、サーバーの状態を変更しないから
export async function GET(request: NextRequest) {
  try {
    // URL からクエリパラメータを取得
    // 例: /api/products?category=clothing&search=シャツ
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // "clothing"
    const search = searchParams.get("search"); // "シャツ"

    let products = [...mockProducts];

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
    // エラーレスポンス（500 = サーバーエラー）
    return NextResponse.json(
      { success: false, error: "商品の取得に失敗しました" },
      { status: 500 }
    );
  }
}
