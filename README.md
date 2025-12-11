# EC Site - React学習プロジェクト Challenge 5

Next.js App Routerを使用したECサイトの実装プロジェクトです。

## 使用技術

- **Next.js 16** - React フルスタックフレームワーク（App Router）
- **React 19** - UIコンポーネントライブラリ
- **TypeScript** - 型安全なJavaScript
- **CSS Modules** - コンポーネントスコープのスタイリング
- **SWR** - データフェッチングライブラリ

## 機能一覧

- 商品一覧表示
- 商品詳細ページ
- カート機能（追加・削除・数量変更）
- チェックアウトフォーム（バリデーション付き）
- 注文確認ページ
- レスポンシブデザイン

## プロジェクト構成

```text
ec-site/
├── src/
│   ├── app/                    # ページ・ルーティング
│   │   ├── page.tsx            # ホームページ
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── cart/               # カートページ
│   │   ├── checkout/           # チェックアウトページ
│   │   └── products/           # 商品ページ
│   │       ├── page.tsx        # 商品一覧
│   │       └── [id]/           # 商品詳細（動的ルート）
│   ├── components/             # 再利用可能コンポーネント
│   │   ├── AddToCartButton/    # カート追加ボタン
│   │   ├── CartItem/           # カート商品アイテム
│   │   ├── CheckoutForm/       # チェックアウトフォーム
│   │   ├── Footer/             # フッター
│   │   ├── Header/             # ヘッダー
│   │   ├── OrderSummary/       # 注文サマリー
│   │   └── ProductCard/        # 商品カード
│   ├── context/                # React Context
│   │   └── CartContext.tsx     # カート状態管理
│   ├── data/                   # 静的データ
│   │   └── products.ts         # 商品データ
│   └── types/                  # TypeScript型定義
│       └── index.ts
├── public/                     # 静的ファイル
│   └── images/                 # 画像ファイル
│       ├── hero-bg.png         # ヒーローセクション背景
│       └── products/           # 商品画像
└── package.json
```

## 画像ファイル一覧

### ヒーロー背景

| ファイル | 説明 |
|----------|------|
| `hero-bg.png` | トップページのヒーローセクション背景画像 |

### 商品画像

| ファイル | 商品名 | カテゴリ |
|----------|--------|----------|
| `product-1.png` | プレミアムTシャツ | clothing |
| `product-2.png` | ワイヤレスイヤホン Pro | electronics |
| `product-3.png` | React実践入門ガイド | books |
| `product-4.png` | オーガニックコーヒー豆 | food |
| `product-5.png` | スマートウォッチ X1 | electronics |
| `product-6.png` | デニムジャケット | clothing |
| `product-7.png` | TypeScript入門 | books |
| `product-8.png` | 抹茶チョコレートセット | food |
| `product-9.png` | ポータブル充電器 20000mAh | electronics |
| `product-10.png` | レザーウォレット | other |
| `product-11.png` | スニーカー クラシック | clothing |
| `product-12.png` | Next.js 実践ガイド | books |

## セットアップ

### 必要環境

- Node.js 18.0以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintチェック |

## 学習ポイント

### Next.js App Router

- ファイルベースルーティング
- Server Components と Client Components
- 動的ルート（`[id]`）

### React状態管理

- Context APIによるグローバル状態（カート）
- useStateによるローカル状態
- localStorageとの連携

### TypeScript

- 型定義による安全なコード
- interfaceとtypeの活用

### CSS Modules

- コンポーネントスコープのスタイル
- CSS変数によるデザイントークン
