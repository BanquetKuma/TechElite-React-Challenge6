// ========================================
// Footer Component
// ========================================
// ECサイトのフッターコンポーネント
// ブランド情報、ナビゲーションリンク、お問い合わせ情報を含む

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* フッターグリッド */}
        <div className={styles.grid}>
          {/* ブランドセクション */}
          <div className={styles.brand}>
            <span className={styles.brandName}>EC Site</span>
            <p className={styles.brandDescription}>
              高品質な商品を取り揃えた、信頼のECサイトです。
              お客様の満足を第一に、迅速な配送と丁寧なサポートをお約束します。
            </p>
          </div>

          {/* ショッピングリンク */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>ショッピング</h3>
            <div className={styles.sectionLinks}>
              <Link href="/products" className={styles.link}>
                商品一覧
              </Link>
              <Link href="/cart" className={styles.link}>
                カート
              </Link>
            </div>
          </div>

          {/* サポートリンク */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>サポート</h3>
            <div className={styles.sectionLinks}>
              <Link href="#" className={styles.link}>
                よくある質問
              </Link>
              <Link href="#" className={styles.link}>
                配送について
              </Link>
              <Link href="#" className={styles.link}>
                返品・交換
              </Link>
            </div>
          </div>

          {/* お問い合わせ情報 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>お問い合わせ</h3>
            <div className={styles.sectionLinks}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>support@ecsite.example.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>0120-XXX-XXX</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🕐</span>
                <span>平日 9:00〜18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* フッターボトム */}
        <div className={styles.bottom}>
          <div className={styles.socialLinks}>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Twitter"
              title="Twitter"
            >
              𝕏
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Instagram"
              title="Instagram"
            >
              📷
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Facebook"
              title="Facebook"
            >
              f
            </a>
          </div>
          <p className={styles.copyright}>
            © {currentYear} EC Site. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
