import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ========================================
// 保護対象のパス定義
// ========================================
const protectedPaths = ["/user"];
const authPaths = ["/login"];

// ========================================
// ミドルウェア関数
// ========================================
export async function middleware(request: NextRequest) {
  // JWT トークンを取得（NextAuth.js のセッション確認）
  // 解説: getToken は NextAuth.js が暗号化したJWTクッキーを復号化してユーザー情報を取得します
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // 暗号化に使用したシークレット（必須）
  });

  // 現在のアクセスパスを取得
  const { pathname } = request.nextUrl;

  // ========================================
  // デバッグ用ログ（開発時のみ使用）
  // ========================================
  // 以下のコメントを外すとミドルウェアの動作を確認できます
  // console.log('ミドルウェア実行:', {
  //   pathname,
  //   hasToken: !!token,
  //   userId: token?.id,
  // });

  // 保護対象パスのチェック
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // ========================================
  // 認証が必要なページのチェック
  // ========================================

  // 未認証で保護対象パスにアクセス → ログインへリダイレクト
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);

    // callbackUrl: ログイン後に元のページに戻るための仕組み
    // 例: /user/orders にアクセス → /login?callbackUrl=/user/orders へリダイレクト
    //     → ログイン成功 → /user/orders に戻る
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ========================================
  // ログイン済みユーザーのログインページアクセス
  // ========================================

  // 既にログイン済みならログインページからリダイレクト
  // 理由: ログイン済みユーザーが再度ログインページを見る必要はないため
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ========================================
  // すべてのチェックをパスした場合は続行
  // ========================================
  // NextResponse.next() = 「このリクエストは問題なし、次の処理へ進んでOK」
  return NextResponse.next();
}

// ========================================
// ミドルウェアを適用するパスの設定
// ========================================
// matcher: このミドルウェアを実行する対象パスを指定
// 解説: 全てのリクエストで実行すると無駄なので、必要な箇所のみ指定する
export const config = {
  matcher: [
    // 保護対象のパス
    "/user/:path*", // /user/orders, /user/profile など全て
    "/checkout/:path*", // /checkout, /checkout/confirm など全て
    "/login", // ログインページ（ログイン済みユーザー対策）
  ],
};
