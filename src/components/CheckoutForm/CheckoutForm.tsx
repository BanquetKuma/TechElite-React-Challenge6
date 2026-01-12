"use client";

// ========================================
// CheckoutForm Component
// ========================================
// 注文情報入力フォームコンポーネント
// バリデーション機能付き

import { useState } from "react";
import type { CheckoutFormProps, CheckoutFormData, FormErrors, PaymentMethod } from "@/types";
import styles from "./CheckoutForm.module.css";

// 支払い方法のラベル
const paymentMethodLabels: Record<PaymentMethod, string> = {
  credit: "クレジットカード",
  bank: "銀行振込",
  cod: "代金引換",
};

// 初期フォームデータ
const initialFormData: CheckoutFormData = {
  name: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "credit",
};

// バリデーション関数
function validateForm(data: CheckoutFormData): FormErrors {
  const errors: FormErrors = {};

  // 名前
  if (!data.name.trim()) {
    errors.name = "お名前を入力してください";
  }

  // メールアドレス
  if (!data.email.trim()) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "⚠️ メールアドレスの形式が正しくありません。「example@domain.com」のような形式で入力してください";
  }

  // 郵便番号
  if (!data.postalCode.trim()) {
    errors.postalCode = "郵便番号を入力してください";
  } else if (!/^\d{3}-?\d{4}$/.test(data.postalCode)) {
    errors.postalCode = "⚠️ 郵便番号の形式が正しくありません。7桁の数字を「123-4567」または「1234567」の形式で入力してください";
  }

  // 市区町村
  if (!data.city.trim()) {
    errors.city = "市区町村を入力してください";
  }

  // 住所
  if (!data.address.trim()) {
    errors.address = "住所を入力してください";
  }

  return errors;
}

export default function CheckoutForm({
  onSubmit,
  isSubmitting,
  onPaymentMethodChange,
  defaultValues,
}: CheckoutFormProps) {
  // 解説: defaultValues があれば初期値として使用 (「戻る」ボタン対応)
  const [formData, setFormData] = useState<CheckoutFormData>(
    defaultValues || initialFormData
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 入力変更ハンドラー
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 支払い方法変更時にコールバックを呼び出す
    if (name === "paymentMethod" && onPaymentMethodChange) {
      onPaymentMethodChange(value as PaymentMethod);
    }

    // リアルタイムバリデーション（フィールドがタッチ済みの場合）
    if (touched[name]) {
      const newErrors = validateForm({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof CheckoutFormData],
      }));
    }
  };

  // フィールドブラーハンドラー
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // ブラー時にバリデーション
    const newErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name as keyof CheckoutFormData],
    }));
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 全フィールドをタッチ済みに
    const allTouched = Object.keys(initialFormData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // バリデーション
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // エラーがなければ送信
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form id="checkout-form" className={styles.form} onSubmit={handleSubmit}>
      {/* お客様情報 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お客様情報</h2>

        {/* お名前 */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            お名前<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            placeholder="山田 太郎"
          />
          {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
        </div>

        {/* メールアドレス */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス<span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>
      </section>

      {/* 配送先住所 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>配送先住所</h2>

        {/* 郵便番号・市区町村 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="postalCode" className={styles.label}>
              郵便番号<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.postalCode ? styles.inputError : ""}`}
              placeholder="123-4567"
            />
            {errors.postalCode && (
              <p className={styles.errorMessage}>{errors.postalCode}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city" className={styles.label}>
              市区町村<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
              placeholder="東京都渋谷区"
            />
            {errors.city && (
              <p className={styles.errorMessage}>{errors.city}</p>
            )}
          </div>
        </div>

        {/* 住所 */}
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>
            住所<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
            placeholder="○○町1-2-3 ○○マンション101"
          />
          {errors.address && (
            <p className={styles.errorMessage}>{errors.address}</p>
          )}
        </div>
      </section>

      {/* 支払い方法 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お支払い方法</h2>

        <div className={styles.paymentMethods}>
          {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map(
            (method) => (
              <label key={method} className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>
                  {paymentMethodLabels[method]}
                </span>
              </label>
            )
          )}
        </div>

        {formData.paymentMethod === "cod" && (
          <p className={styles.paymentNote}>
            ※代金引換手数料330円が別途かかります
          </p>
        )}
      </section>

    </form>
  );
}
