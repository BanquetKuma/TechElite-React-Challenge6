// ========================================
// 商品関連の型定義
// ========================================

/**
 * 商品の型定義
 */
export type Product = {
  /** 商品ID */
  id: number;
  /** 商品名 */
  title: string;
  /** 価格（税込） */
  price: number;
  /** 商品説明 */
  description: string;
  /** 商品画像URL */
  imageUrl: string;
  /** カテゴリ */
  category: string;
  /** 在庫数 */
  stock: number;
};

/**
 * 商品カテゴリの型定義
 */
export type ProductCategory =
  | "clothing"
  | "electronics"
  | "books"
  | "food"
  | "other";

// ========================================
// カート関連の型定義
// ========================================

/**
 * カートアイテムの型定義
 */
export type CartItem = {
  /** 商品情報 */
  product: Product;
  /** 数量 */
  quantity: number;
};

/**
 * カートコンテキストの値の型定義
 */
export type CartContextValue = {
  /** カート内のアイテム一覧 */
  cartItems: CartItem[];
  /** 商品をカートに追加 */
  addItem: (product: Product) => void;
  /** 商品をカートから削除 */
  removeItem: (productId: number) => void;
  /** 商品の数量を更新 */
  updateQuantity: (productId: number, quantity: number) => void;
  /** カートを空にする */
  clearCart: () => void;
  /** カート内の合計金額 */
  totalPrice: number;
  /** カート内の合計アイテム数 */
  totalItems: number;
};

// ========================================
// チェックアウト関連の型定義
// ========================================

/**
 * 支払い方法の型定義
 */
export type PaymentMethod = "credit" | "bank" | "cod";

/**
 * チェックアウトフォームのデータ型定義
 */
export type CheckoutFormData = {
  /** お名前 */
  name: string;
  /** メールアドレス */
  email: string;
  /** 住所 */
  address: string;
  /** 市区町村 */
  city: string;
  /** 郵便番号 */
  postalCode: string;
  /** 支払い方法 */
  paymentMethod: PaymentMethod;
};

/**
 * フォームエラーの型定義
 */
export type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

// ========================================
// 注文関連の型定義
// ========================================

/**
 * 注文ステータスの型定義
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 注文の型定義
 */
export type Order = {
  /** 注文ID */
  id: string;
  /** 注文日時 */
  createdAt: Date;
  /** 注文アイテム */
  items: CartItem[];
  /** 合計金額 */
  totalPrice: number;
  /** 配送情報 */
  shippingInfo: CheckoutFormData;
  /** 注文ステータス */
  status: OrderStatus;
};

/**
 * 保存される注文データの型定義（API用）
 * 解説: createdAt を string で保持（JSON シリアライズ対応）
 */
export type SavedOrder = {
  /** 注文ID */
  id: string;
  /** ユーザーID */
  userId: string;
  /** 注文アイテム */
  items: CartItem[];
  /** 配送情報 */
  shippingInfo: CheckoutFormData;
  /** 合計金額 */
  totalPrice: number;
  /** 注文日時（ISO 8601形式の文字列） */
  createdAt: string;
  /** 注文ステータス */
  status: OrderStatus;
};

/**
 * 注文コンテキストの値の型定義
 * 解説: Context API で共有する注文関連の状態と操作
 */
export type OrderContextValue = {
  /** 注文履歴 */
  orders: SavedOrder[];
  /** 注文を追加 (orderId は Server Action から渡す) */
  addOrder: (order: Omit<SavedOrder, "createdAt">) => SavedOrder;
  /** 注文履歴を取得 */
  fetchOrders: () => Promise<void>;
  /** ローディング状態 */
  isLoading: boolean;
};

// ========================================
// お気に入り関連の型定義
// ========================================

/**
 * お気に入りコンテキストの値の型定義
 * 解説: Context API で共有するお気に入り関連の状態と操作
 */
export type FavoritesContextValue = {
  /** お気に入り商品リスト */
  favorites: Product[];
  /** お気に入りに追加 */
  addFavorite: (product: Product) => void;
  /** お気に入りから削除 */
  removeFavorite: (productId: number) => void;
  /** お気に入り判定 */
  isFavorite: (productId: number) => boolean;
  /** お気に入りをクリア */
  clearFavorites: () => void;
  /** お気に入り数 */
  favoritesCount: number;
};

// ========================================
// API関連の型定義
// ========================================

/**
 * APIレスポンスの基本型
 */
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

/**
 * ページネーション情報の型定義
 */
export type PaginationInfo = {
  /** 現在のページ */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** 1ページあたりのアイテム数 */
  itemsPerPage: number;
  /** 総アイテム数 */
  totalItems: number;
};

/**
 * ページネーション付きAPIレスポンスの型定義
 */
export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: PaginationInfo;
};

// ========================================
// コンポーネントProps関連の型定義
// ========================================

/**
 * ProductCardコンポーネントのProps
 */
export type ProductCardProps = {
  product: Product;
};

/**
 * CartItemコンポーネントのProps
 */
export type CartItemProps = {
  item: CartItem;
};

/**
 * AddToCartButtonコンポーネントのProps
 */
export type AddToCartButtonProps = {
  product: Product;
  disabled?: boolean;
};

/**
 * CheckoutFormコンポーネントのProps
 */
export type CheckoutFormProps = {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  defaultValues?: CheckoutFormData;
};

/**
 * OrderSummaryコンポーネントのProps
 */
export type OrderSummaryProps = {
  items: CartItem[];
  total: number;
  paymentMethod?: PaymentMethod;
  isSubmitting?: boolean;
  showSubmitButton?: boolean;
};
