import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const { amount, description, admin, receiverId } = JSON.parse(
      await req.text()
    );
    const isMemberExist = await prismaClient.member.findFirst({
      where: { id: userId },
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const depositTransaction = await prismaClient.transaction.create({
      data: {
        type: "TRANSFER",
        description,
        amount,
        balanceBefore: isMemberExist.balance,
        balanceAfter: isMemberExist.balance - amount,
        member: { connect: { id: userId } },
        transferring: { connect: { id: userId } },
        receiving: { connect: { id: receiverId } },
        admin: { connect: { id: admin } },
      },
    });

    const updateTransferringMember = await prismaClient.member.update({
      where: { id: userId },
      data: {
        balance: isMemberExist.balance - amount,
        transactions: {
          connect: { id: depositTransaction.id },
        },
      },
    });

    const updateReceivingMember = await prismaClient.member.update({
      where: { id: receiverId },
      data: {
        balance: isMemberExist.balance + amount,
      },
    });

    return Response.json({
      status: 201,
      depositTransaction,
      updateTransferringMember,
      updateReceivingMember,
    });
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
      where: {
        memberId: userId,
        AND: {
          type: "TRANSFER",
        },
        OR: [
          {
            transferring: {
              id: userId,
            },
          },
          {
            receiving: {
              id: userId,
            },
          },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ status: 200, transactions });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
