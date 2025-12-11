import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

// ========================================
// Metadata（SEO設定）
// ========================================
export const metadata: Metadata = {
  title: {
    default: "EC Site",
    template: "%s | EC Site",
  },
  description: "Next.js App Routerで構築した高品質ECサイト",
  keywords: ["EC", "ショッピング", "Next.js", "React"],
  authors: [{ name: "EC Site Team" }],
  openGraph: {
    title: "EC Site",
    description: "Next.js App Routerで構築した高品質ECサイト",
    type: "website",
    locale: "ja_JP",
  },
};

// ========================================
// Root Layout Component
// ========================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* CartProviderでアプリ全体をラップ */}
        <CartProvider>
          {/* ヘッダー（全ページ共通） */}
          <Header />

          {/* メインコンテンツ */}
          <main>{children}</main>

          {/* フッター（全ページ共通） */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
