# EC Site - React学習プロジェクト Challenge 6

Next.js App Routerを使用したECサイトの実装プロジェクトです。
Challenge 6では、NextAuth.js認証とSupabase PostgreSQLによるデータ永続化を実装しています。

## デプロイURL

https://tech-elite-react-challenge6.vercel.app/

## 使用技術

- **Next.js 16** - React フルスタックフレームワーク (App Router)
- **React 19** - UIコンポーネントライブラリ
- **TypeScript** - 型安全なJavaScript
- **CSS Modules** - コンポーネントスコープのスタイリング
- **SWR** - データフェッチングライブラリ
- **NextAuth.js v4** - 認証ライブラリ (JWT方式)
- **Prisma** - TypeScript ORM
- **Supabase** - PostgreSQLマネージドデータベース
- **bcryptjs** - パスワードハッシュ化

## 機能一覧

### 基本機能
- 商品一覧表示
- 商品詳細ページ
- カート機能 (追加・削除・数量変更)
- チェックアウトフォーム (バリデーション付き)
- 注文確認ページ
- レスポンシブデザイン

### 認証機能 (Challenge 6 新規)
- ユーザー新規登録
- ログイン/ログアウト
- パスワードハッシュ化 (bcrypt)
- JWT方式セッション管理

### データ永続化 (Challenge 6 新規)
- 注文履歴のDB保存 (Supabase)
- ユーザー別注文履歴表示
- Vercelデプロイ後も永続化維持

## プロジェクト構成

```text
ec-site/
├── src/
│   ├── app/                    # ページ・ルーティング
│   │   ├── page.tsx            # ホームページ
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── api/                # APIルート
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts  # NextAuth API
│   │   │   │   └── register/route.ts       # 新規登録API
│   │   │   └── orders/route.ts             # 注文API
│   │   ├── cart/               # カートページ
│   │   ├── checkout/           # チェックアウトページ
│   │   ├── login/              # ログインページ
│   │   ├── register/           # 新規登録ページ
│   │   ├── products/           # 商品ページ
│   │   │   ├── page.tsx        # 商品一覧
│   │   │   └── [id]/           # 商品詳細 (動的ルート)
│   │   └── user/
│   │       └── orders/         # 注文履歴ページ
│   ├── components/             # 再利用可能コンポーネント
│   │   ├── AddToCartButton/    # カート追加ボタン
│   │   ├── CartItem/           # カート商品アイテム
│   │   ├── CheckoutForm/       # チェックアウトフォーム
│   │   ├── Footer/             # フッター
│   │   ├── Header/             # ヘッダー
│   │   ├── OrderSummary/       # 注文サマリー
│   │   └── ProductCard/        # 商品カード
│   ├── context/                # React Context
│   │   ├── CartContext.tsx     # カート状態管理
│   │   └── OrderContext.tsx    # 注文状態管理
│   ├── lib/                    # ユーティリティ
│   │   ├── prisma.ts           # Prismaクライアント
│   │   └── authOptions.ts      # NextAuth設定
│   ├── data/                   # 静的データ
│   │   └── products.ts         # 商品データ
│   └── types/                  # TypeScript型定義
│       └── index.ts
├── prisma/
│   └── schema.prisma           # DBスキーマ定義
├── public/                     # 静的ファイル
│   └── images/                 # 画像ファイル
│       ├── hero-bg.png         # ヒーローセクション背景
│       └── products/           # 商品画像
└── package.json
```

## データベーススキーマ

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // bcryptハッシュ
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id           String   @id
  userId       String
  items        String   // JSON (CartItem[])
  shippingInfo String   // JSON (CheckoutFormData)
  totalPrice   Int
  status       String   @default("confirmed")
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}
```

## セットアップ

### 必要環境

- Node.js 18.0以上
- npm
- Supabaseアカウント (データベース用)

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定 (.env.localを作成)
cp .env.example .env.local
# DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL を設定

# Prismaクライアント生成
npx prisma generate

# マイグレーション実行
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 環境変数

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintチェック |
| `npx prisma studio` | DBビューア起動 |

## 学習ポイント

### Next.js App Router
- ファイルベースルーティング
- Server Components と Client Components
- 動的ルート (`[id]`)
- APIルート (Route Handlers)

### React状態管理
- Context APIによるグローバル状態 (カート、注文)
- useStateによるローカル状態
- localStorageとの連携

### NextAuth.js認証
- Credentials Provider (メール/パスワード)
- JWT方式セッション管理
- カスタムログインページ
- セッションコールバック

### Prisma + Supabase
- TypeScript型安全なORM
- PostgreSQLマイグレーション
- Connection Pooler設定

### セキュリティ
- bcryptによるパスワードハッシュ
- 環境変数による秘密情報管理
- CSRFプロテクション

### TypeScript
- 型定義による安全なコード
- interfaceとtypeの活用

### CSS Modules
- コンポーネントスコープのスタイル
- CSS変数によるデザイントークン
