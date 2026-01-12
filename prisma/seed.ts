import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

// .env ファイルを読み込む
config();
config({ path: ".env.local" });

// DIRECT_URL (Session mode) を使用してPrepared Statements問題を回避
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function main() {
  // authOptions.ts と同じパスワードをハッシュ化
  const password1 = bcrypt.hashSync("password123", 10);
  const password2 = bcrypt.hashSync("admin123", 10);

  // モックユーザーを作成
  const user1 = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { password: password1 },
    create: {
      id: "1",
      email: "user@example.com",
      name: "テストユーザー",
      password: password1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: password2 },
    create: {
      id: "2",
      email: "admin@example.com",
      name: "管理者",
      password: password2,
    },
  });

  console.log("Created users:", { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
