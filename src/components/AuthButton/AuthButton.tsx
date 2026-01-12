"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./AuthButton.module.css";

export default function AuthButton() {
  // useSession フックでログイン状態を取得
  const { data: session, status } = useSession();

  // ローディング中
  if (status === "loading") {
    return <div className={styles.loading}>...</div>;
  }

  // ログイン済み
  if (session) {
    return (
      <div className={styles.userMenu}>
        <span className={styles.userName}>{session.user?.name}</span>
        <Link href="/user/orders" className={styles.link}>
          購入履歴
        </Link>
        <button onClick={() => signOut()} className={styles.logoutButton}>
          ログアウト
        </button>
      </div>
    );
  }

  // 未ログイン
  return (
    <Link href="/login" className={styles.loginLink}>
      ログイン
    </Link>
  );
}
