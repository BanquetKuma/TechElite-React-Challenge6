# EC Site - React学習プロジェクト Challenge 6

Next.js App Routerを使用したECサイトの実装プロジェクトです。
Challenge 6では、NextAuth.js認証、Supabase PostgreSQLによるデータ永続化、Stripe決済連携を実装しています。

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
- **Stripe** - オンライン決済プラットフォーム
- **bcryptjs** - パスワードハッシュ化

## 機能一覧

### 基本機能
- 商品一覧表示
- 商品詳細ページ
- カート機能 (追加・削除・数量変更)
- チェックアウトフォーム (バリデーション付き)
- 注文確認ページ
- レスポンシブデザイン

### 認証機能
- ユーザー新規登録
- ログイン/ログアウト
- パスワードハッシュ化 (bcrypt)
- JWT方式セッション管理

### データ永続化
- 注文履歴のDB保存 (Supabase)
- 商品データのDB管理 (動的在庫)
- ユーザー別注文履歴表示
- Vercelデプロイ後も永続化維持

### 動的在庫管理 (新規)
- 商品在庫のリアルタイム管理
- 注文確定時に在庫を自動減算
- 在庫切れ商品の購入防止
- DB在庫チェック (決済前・注文確定時)

### Stripe決済連携 (新規)
- クレジットカード決済 (Stripe Checkout)
- テストモード対応
- 決済完了後の注文自動保存
- 購入履歴への反映

### お気に入り機能 (新規)
- 商品のお気に入り登録/解除
- お気に入り一覧ページ
- LocalStorage永続化

### 検索機能 (新規)
- キーワードによる商品検索
- 商品名・説明での絞り込み

### 購入履歴機能 (新規)
- 注文履歴一覧表示
- 商品画像付き表示
- 全注文の合計金額表示

## Stripe決済テスト方法

### テスト用カード情報

Stripeテストモードでは、以下のテストカードが使用できます:

| カード番号 | 説明 |
|------------|------|
| `4242 4242 4242 4242` | 決済成功 |
| `4000 0000 0000 0002` | カード拒否 |
| `4000 0000 0000 9995` | 残高不足 |

**共通設定:**
- 有効期限: 任意の未来日付 (例: `12/34`)
- CVC: 任意の3桁 (例: `123`)
- 郵便番号: 任意 (例: `12345`)

### 決済テスト手順

1. 商品をカートに追加
2. チェックアウトページで配送先情報を入力
3. 支払い方法で「クレジットカード」を選択
4. 「注文を確定する」をクリック
5. Stripe Checkoutページでテストカード情報を入力
6. 「支払う」ボタンをクリック
7. 決済完了後、自動的に完了ページにリダイレクト
8. 購入履歴ページで注文を確認

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
│   │   │   ├── orders/route.ts             # 注文API
│   │   │   └── stripe/                     # Stripe API
│   │   │       ├── checkout-session/route.ts  # Checkout Session作成
│   │   │       ├── session/[sessionId]/route.ts # Session情報取得
│   │   │       └── webhook/route.ts        # Webhook受信
│   │   ├── cart/               # カートページ
│   │   ├── checkout/           # チェックアウトページ
│   │   │   ├── page.tsx        # チェックアウトフォーム
│   │   │   └── complete/       # 決済完了ページ
│   │   ├── favorites/          # お気に入りページ
│   │   ├── login/              # ログインページ
│   │   ├── register/           # 新規登録ページ
│   │   ├── products/           # 商品ページ
│   │   │   ├── page.tsx        # 商品一覧
│   │   │   └── [id]/           # 商品詳細 (動的ルート)
│   │   └── user/
│   │       └── orders/         # 購入履歴ページ
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
│   │   ├── OrderContext.tsx    # 注文状態管理
│   │   └── FavoritesContext.tsx # お気に入り状態管理
│   ├── lib/                    # ユーティリティ
│   │   ├── prisma.ts           # Prismaクライアント
│   │   ├── authOptions.ts      # NextAuth設定
│   │   ├── stripe.ts           # Stripeサーバークライアント
│   │   └── stripe-client.ts    # Stripeクライアントサイド
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

model Product {
  id          Int      @id @default(autoincrement())
  title       String
  price       Int
  description String
  imageUrl    String
  category    String
  stock       Int      @default(0)  // 動的在庫管理
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 在庫管理フロー

```
1. 商品ページ表示 → DBから最新在庫を取得
2. カート追加 → 在庫上限チェック
3. Stripe決済前 → DBから在庫を再確認
4. 注文確定 → トランザクションで在庫を減算
```

## セットアップ

### 必要環境

- Node.js 18.0以上
- npm
- Supabaseアカウント (データベース用)
- Stripeアカウント (決済用)

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定 (.env.localを作成)
cp .env.example .env.local
# 各種環境変数を設定

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

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # 本番環境用
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
- Context APIによるグローバル状態 (カート、注文、お気に入り)
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

### Stripe決済連携
- Stripe Checkout (ホスト型決済ページ)
- Checkout Session API
- metadataによるカート情報保存
- 決済完了後の注文自動保存

### セキュリティ
- bcryptによるパスワードハッシュ
- 環境変数による秘密情報管理
- CSRFプロテクション
- Stripe署名検証 (Webhook)

### TypeScript
- 型定義による安全なコード
- interfaceとtypeの活用

### CSS Modules
- コンポーネントスコープのスタイル
- CSS変数によるデザイントークン
