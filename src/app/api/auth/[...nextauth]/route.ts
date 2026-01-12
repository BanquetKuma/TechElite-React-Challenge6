import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// NextAuth ハンドラーを作成
const handler = NextAuth(authOptions);

// GET と POST の両方を処理
// GET: セッション取得、CSRF トークン取得など
// POST: ログイン、ログアウトなど
export { handler as GET, handler as POST };
