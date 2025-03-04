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

    const depositTransaction = await prismaClient.transaction.create({
      data: {
        type: "DEPOSIT",
        description,
        amount,
        balanceBefore: isMemberExist.balance,
        balanceAfter: isMemberExist.balance + amount,
        member: { connect: { id: userId } },
        admin: { connect: { id: admin } },
      },
    });

    const updatedMember = await prismaClient.member.update({
      where: { id: isMemberExist.id },
      data: {
        balance: isMemberExist.balance + amount,
      },
    });

    return Response.json({ status: 201, depositTransaction, updatedMember });
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
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const transactions = await prismaClient.transaction.findMany({
      where: { memberId: userId },
      skip,
      take: limit,
    });

    return Response.json({ status: 200, transactions });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
