import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

// ========================================
// フォント設定
// ========================================
// 解説: Noto Sans JP を Google Fonts から最適化して読み込み
// - subsets: 使用する文字セット（latin は基本のアルファベット）
// - weight: 読み込むフォントの太さ（400=通常、500=中太、700=太字）
// - display: swap = フォント読み込み中はシステムフォントを表示（CLS対策）
// - preload: 事前読み込みで表示を高速化
// - variable: CSS変数として使用可能に
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
  variable: "--font-noto-sans-jp",
});

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
    <html lang="ja" className={notoSansJP.variable}>
      <body className={notoSansJP.className}>
        {/* SessionWrapperで認証状態を共有 */}
        <SessionWrapper>
          {/* CartProviderでカート状態を共有 */}
          <CartProvider>
            {/* FavoritesProviderでお気に入り状態を共有 */}
            <FavoritesProvider>
              {/* OrderProviderで注文履歴を共有 */}
              <OrderProvider>
                {/* ヘッダー（全ページ共通） */}
                <Header />

                {/* メインコンテンツ */}
                <main>{children}</main>

                {/* フッター（全ページ共通） */}
                <Footer />
              </OrderProvider>
            </FavoritesProvider>
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
