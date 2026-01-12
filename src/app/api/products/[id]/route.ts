import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/data/products";

// ========================================
// GET: 商品詳細を取得
// ========================================
// [id] の部分が params.id として渡される
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 動的パラメータを取得（Next.js 14+ では await が必要）
    const { id } = await params;
    const productId = parseInt(id, 10);

    // バリデーション: 数値として有効か？
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "無効な商品IDです" },
        { status: 400 } // Bad Request
      );
    }

    // 商品を検索
    const product = getProductById(productId);

    // 見つからない場合
    if (!product) {
      return NextResponse.json(
        { success: false, error: "商品が見つかりません" },
        { status: 404 } // Not Found
      );
    }

    // 成功
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "商品の取得に失敗しました" },
      { status: 500 }
    );
  }
}
