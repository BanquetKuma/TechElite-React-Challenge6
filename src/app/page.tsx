import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

// お知らせデータ
const announcements = [
  {
    id: 1,
    date: "2024.12.09",
    title: "冬のセール開催中！",
    description: "対象商品が最大30%OFF。12月25日まで。",
    isNew: true,
  },
  {
    id: 2,
    date: "2024.12.05",
    title: "新商品入荷のお知らせ",
    description: "人気のワイヤレスイヤホンシリーズに新モデルが登場しました。",
    isNew: true,
  },
  {
    id: 3,
    date: "2024.12.01",
    title: "年末年始の配送について",
    description: "12月28日〜1月3日は配送休業とさせていただきます。",
    isNew: false,
  },
];

// Server Component: 直接Prismaでデータ取得
export default async function HomePage() {
  // DBから最新商品4件を取得
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { id: "asc" },
  });

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>EC Site へようこそ</h1>
        <p className={styles.heroSubtitle}>
          高品質な商品を取り揃えております
        </p>
        <Link href="/products" className={styles.heroButton}>
          商品を見る
        </Link>
      </section>

      {/* Latest Products Section */}
      <section className={styles.latestProducts}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>最新の商品</h2>
          <Link href="/products" className={styles.viewAllLink}>
            すべて見る →
          </Link>
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={styles.productCard}
            >
              <div className={styles.productImageWrapper}>
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>
                  ¥{product.price.toLocaleString("ja-JP")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* News/Announcements Section */}
      <section className={styles.newsSection}>
        <h2 className={styles.sectionTitle}>お知らせ</h2>
        <div className={styles.newsList}>
          {announcements.map((news) => (
            <article key={news.id} className={styles.newsItem}>
              <div className={styles.newsMeta}>
                <time className={styles.newsDate}>{news.date}</time>
                {news.isNew && <span className={styles.newBadge}>NEW</span>}
              </div>
              <div className={styles.newsContent}>
                <h3 className={styles.newsTitle}>{news.title}</h3>
                <p className={styles.newsDescription}>{news.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>特徴</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>高品質</h3>
            <p>厳選された高品質な商品のみを取り扱っています</p>
          </div>
          <div className={styles.featureCard}>
            <h3>迅速配送</h3>
            <p>ご注文から最短翌日にお届けいたします</p>
          </div>
          <div className={styles.featureCard}>
            <h3>安心サポート</h3>
            <p>専門スタッフが丁寧にサポートいたします</p>
          </div>
        </div>
      </section>
    </div>
  );
}
