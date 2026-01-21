import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

// .env ファイルを読み込む
config();
config({ path: ".env.local" });

// DIRECT_URL (Session mode) を使用してPrepared Statements問題を回避
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

// ========================================
// 商品データ (src/data/products.ts と同期)
// ========================================
const mockProducts = [
  {
    id: 1,
    title: "プレミアムTシャツ",
    price: 3980,
    description:
      "上質なコットン100%で作られた快適な着心地のTシャツです。シンプルなデザインでどんなコーディネートにも合わせやすい一着。",
    imageUrl: "/images/products/product-1.png",
    category: "clothing",
    stock: 15,
  },
  {
    id: 2,
    title: "ワイヤレスイヤホン Pro",
    price: 12800,
    description:
      "高音質のBluetoothイヤホン。ノイズキャンセリング機能搭載で、音楽に没頭できます。最大24時間の連続再生が可能。",
    imageUrl: "/images/products/product-2.png",
    category: "electronics",
    stock: 8,
  },
  {
    id: 3,
    title: "React実践入門ガイド",
    price: 2980,
    description:
      "Reactの基礎から応用まで網羅した実践的な技術書。豊富なサンプルコードと丁寧な解説で初心者にもおすすめ。",
    imageUrl: "/images/products/product-3.png",
    category: "books",
    stock: 25,
  },
  {
    id: 4,
    title: "オーガニックコーヒー豆",
    price: 1580,
    description:
      "厳選されたオーガニックコーヒー豆。深いコクと芳醇な香りが特徴。毎朝の一杯に最適な200g入り。",
    imageUrl: "/images/products/product-4.png",
    category: "food",
    stock: 30,
  },
  {
    id: 5,
    title: "スマートウォッチ X1",
    price: 24800,
    description:
      "健康管理に最適なスマートウォッチ。心拍数、睡眠トラッキング、運動記録など多機能。防水性能IPX7。",
    imageUrl: "/images/products/product-5.png",
    category: "electronics",
    stock: 5,
  },
  {
    id: 6,
    title: "デニムジャケット",
    price: 8900,
    description:
      "カジュアルスタイルに欠かせないデニムジャケット。程よいフィット感で、オールシーズン活躍します。",
    imageUrl: "/images/products/product-6.png",
    category: "clothing",
    stock: 12,
  },
  {
    id: 7,
    title: "TypeScript入門",
    price: 3200,
    description:
      "JavaScriptからTypeScriptへのステップアップに最適な一冊。型システムの基礎から実践的な活用法まで。",
    imageUrl: "/images/products/product-7.png",
    category: "books",
    stock: 0,
  },
  {
    id: 8,
    title: "抹茶チョコレートセット",
    price: 2480,
    description:
      "京都の老舗茶舗監修の抹茶チョコレート。上品な甘さと抹茶の風味が絶妙にマッチ。12個入り。",
    imageUrl: "/images/products/product-8.png",
    category: "food",
    stock: 20,
  },
  {
    id: 9,
    title: "ポータブル充電器 20000mAh",
    price: 4980,
    description:
      "大容量20000mAhのモバイルバッテリー。スマートフォンを約5回フル充電可能。USB-C対応。",
    imageUrl: "/images/products/product-9.png",
    category: "electronics",
    stock: 3,
  },
  {
    id: 10,
    title: "レザーウォレット",
    price: 6800,
    description:
      "本革を使用した高級感のある二つ折り財布。コンパクトながら収納力抜群。ギフトにも最適。",
    imageUrl: "/images/products/product-10.png",
    category: "other",
    stock: 18,
  },
  {
    id: 11,
    title: "スニーカー クラシック",
    price: 7900,
    description:
      "シンプルで飽きのこないデザインのスニーカー。クッション性に優れた快適な履き心地。",
    imageUrl: "/images/products/product-11.png",
    category: "clothing",
    stock: 10,
  },
  {
    id: 12,
    title: "Next.js 実践ガイド",
    price: 3500,
    description:
      "App Routerに対応したNext.jsの実践書。SSR、ISR、RSCなど最新の機能を徹底解説。",
    imageUrl: "/images/products/product-12.png",
    category: "books",
    stock: 15,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ========================================
  // 1. ユーザーデータ
  // ========================================
  console.log("  - Creating users...");
  // authOptions.ts と同じパスワードをハッシュ化
  const password1 = bcrypt.hashSync("password123", 10);
  const password2 = bcrypt.hashSync("admin123", 10);

  // モックユーザーを作成
  const user1 = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { password: password1 },
    create: {
      id: "1",
      email: "user@example.com",
      name: "テストユーザー",
      password: password1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: password2 },
    create: {
      id: "2",
      email: "admin@example.com",
      name: "管理者",
      password: password2,
    },
  });

  console.log("    Created users:", user1.email, user2.email);

  // ========================================
  // 2. 商品データ
  // ========================================
  console.log("  - Creating products...");

  // 既存の商品データを削除 (開発用)
  await prisma.product.deleteMany();

  // 商品データを投入 (upsert で既存データがあれば更新)
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
      },
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
      },
    });
  }

  console.log(`    Inserted ${mockProducts.length} products`);
  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
