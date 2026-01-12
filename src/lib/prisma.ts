// ========================================
// Prisma Client
// ========================================
// 解説: Prisma クライアントのシングルトンインスタンス
// - 開発環境でのホットリロード時に複数インスタンス生成を防止
// - グローバルオブジェクトにキャッシュすることで再利用
// - 本番環境では新しいインスタンスを都度作成

import { PrismaClient } from "@prisma/client";

// グローバルオブジェクトの型拡張
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma クライアントインスタンス
// - 既存のインスタンスがあれば再利用
// - なければ新規作成
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 開発環境ではグローバルにキャッシュ
// これにより、ホットリロード時に接続数が増加することを防止
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
