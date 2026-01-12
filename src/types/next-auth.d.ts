// NextAuth.js の型を拡張して、
// カスタムプロパティ（id）を追加します
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // 追加: ユーザーID
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // JWTにもidを追加
  }
}
