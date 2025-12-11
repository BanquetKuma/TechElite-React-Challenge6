"use client";

// ========================================
// Header Component
// ========================================
// レスポンシブ対応のヘッダーコンポーネント
// カートアイテム数のバッジ表示機能付き

import { useState, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";

export default function Header() {
  // カート情報を取得
  const { totalItems } = useCart();

  // モバイルメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // メニュー開閉のトグル
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // メニューを閉じる（リンククリック時）
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* ロゴ */}
        <Link href="/" className={styles.logo}>
          EC Site
        </Link>

        {/* デスクトップナビゲーション */}
        <div className={styles.navLinks}>
          <Link href="/products" className={styles.navLink}>
            商品一覧
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            <span className={styles.cartIcon}>🛒</span>
            <span>カート</span>
            {totalItems > 0 && (
              <span className={styles.cartBadge} key={totalItems}>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* モバイルメニューボタン */}
        <button
          className={`${styles.menuButton} ${isMenuOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* モバイルナビゲーション */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ""}`}>
        <Link
          href="/products"
          className={styles.mobileNavLink}
          onClick={closeMenu}
        >
          商品一覧
        </Link>
        <Link
          href="/cart"
          className={styles.mobileCartLink}
          onClick={closeMenu}
        >
          <span>🛒 カート</span>
          {totalItems > 0 && (
            <span className={styles.mobileBadge}>
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
