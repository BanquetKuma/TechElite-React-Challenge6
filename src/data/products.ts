// ========================================
// モック商品データ
// ========================================
// 開発用のサンプル商品データ

import type { Product } from "@/types";

export const mockProducts: Product[] = [
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

// カテゴリでフィルタリングする関数
export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return mockProducts;
  return mockProducts.filter((product) => product.category === category);
}

// IDで商品を取得する関数
export function getProductById(id: number): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

// 全カテゴリを取得する関数
export function getAllCategories(): string[] {
  const categories = new Set(mockProducts.map((product) => product.category));
  return ["all", ...Array.from(categories)];
}
