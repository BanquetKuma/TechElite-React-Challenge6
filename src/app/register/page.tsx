"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        setIsLoading(false);
        return;
      }

      // 登録成功 → ログインページへ
      router.push("/login?registered=true");
    } catch {
      setError("エラーが発生しました");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>新規登録</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">お名前</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="山田 太郎"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
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
                minLength={6}
                placeholder="6文字以上"
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
            {isLoading ? "登録中..." : "登録する"}
          </button>
        </form>

        <div className={styles.loginLink}>
          既にアカウントをお持ちの方は
          <Link href="/login">ログイン</Link>
        </div>

        <Link href="/" className={styles.backLink}>
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
