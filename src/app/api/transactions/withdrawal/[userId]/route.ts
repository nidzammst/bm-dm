import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const { amount, description, admin } = JSON.parse(await req.text());
    const isMemberExist = await prismaClient.member.findFirst({
      where: { id: userId },
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const withdrawalTransaction = await prismaClient.transaction.create({
      data: {
        type: "WITHDRAWAL",
        description,
        amount,
        member: { connect: { id: userId } },
        admin: { connect: { id: admin } },
      },
    });

    return Response.json({ status: 201, withdrawalTransaction });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const { limit, page } = JSON.parse(await req.text());
    const skip = limit * page - 1;

    const isMemberExist = await prismaClient.member.findFirst({
      where: { id: userId },
      skip,
      take: limit,
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const transactions = await prismaClient.transaction.findMany({
      where: { memberId: userId },
    });

    return Response.json({ status: 200, transactions });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
