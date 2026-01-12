"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  // =====================================
  // 状態管理
  // =====================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // =====================================
  // フォーム送信処理
  // =====================================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // ページリロードを防ぐ
    setError(""); // エラーをクリア
    setIsLoading(true); // ローディング開始

    // NextAuth.js の signIn 関数を呼び出し
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // 自動リダイレクトを無効化（エラーハンドリングのため）
    });

    setIsLoading(false);

    if (result?.error) {
      // 認証失敗
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      // 認証成功 → トップページへ
      router.push("/");
      router.refresh(); // ヘッダーの状態を更新
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>ログイン</h1>

        {/* エラーメッセージ */}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">パスワード</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="パスワード"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* 新規登録リンク */}
        <div className={styles.registerLink}>
          アカウントをお持ちでない方は
          <Link href="/register">新規登録</Link>
        </div>

        {/* テスト用アカウント情報 */}
        <div className={styles.testInfo}>
          <p>テスト用アカウント:</p>
          <code>user@example.com / password123</code>
        </div>

        <Link href="/" className={styles.backLink}>
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
