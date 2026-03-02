import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { main } from "../route";

// GETリクエストで特定のブログ投稿を取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id: number = parseInt(req.url.split("/blog/")[1]);
    await main();
    const post = await prisma.post.findFirst({ where: { id } });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};

//投稿の編集
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id: number = parseInt(req.url.split("/blog/")[1]);
    const { title, description } = await req.json();
    await main();
    const post = await prisma.post.update({
      where: { id },
      data: { title, description },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};

//投稿の削除
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: number = parseInt(req.url.split("/blog/")[1]);
    await main();
    const post = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};
