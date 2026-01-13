import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // =====================================
  // 認証プロバイダーの設定
  // =====================================
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // =====================================
      // 認証ロジック (Prisma + Supabase)
      // =====================================
      async authorize(credentials) {
        // 1. 入力チェック
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. DBからユーザー検索
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; // ユーザーが見つからない
        }

        // 3. パスワード検証
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null; // パスワード不一致
        }

        // 4. 認証成功
        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
        };
      },
    }),
  ],

  // =====================================
  // セッション設定
  // =====================================
  session: {
    strategy: "jwt", // JWT方式を使用
  },

  // =====================================
  // カスタムページ設定
  // =====================================
  pages: {
    signIn: "/login", // デフォルトの代わりに自作ページを使用
  },

  // =====================================
  // コールバック関数
  // =====================================
  callbacks: {
    // JWTにユーザーIDを追加
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッションにユーザーIDを追加
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // =====================================
  // 秘密鍵（環境変数から取得）
  // =====================================
  secret: process.env.NEXTAUTH_SECRET,
};
