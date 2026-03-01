import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { NextResponse } from "next/server";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    throw new Error("DB接続に失敗しました");
  }
}

// GETリクエストで全てのブログ投稿を取得

export const GET = async (req: Request) => {
  try {
    await main();
    const posts = await prisma.post.findMany();
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};

// POSTリクエストで新しいブログ投稿を作成

export const POST = async (req: Request) => {
  try {
    const { title, description } = await req.json();
    await main();
    const posts = await prisma.post.create({ data: { title, description } });
    return NextResponse.json({ message: "Success", posts }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};
