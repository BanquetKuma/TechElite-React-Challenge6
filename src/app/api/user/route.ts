import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// ========================================
// GET: 現在のユーザー情報を取得
// ========================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 必要な情報のみ返す（パスワードなどは返さない！）
    return NextResponse.json({
      success: true,
      data: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "ユーザー情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
