import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    const transaction = await prismaClient.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction)
      return new Response("Transaction not found", { status: 404 });

    return Response.json({ status: 200, transaction });
  } catch (error) {
    return new Response(`Error fetching transaction: ${error}`, {
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    const { amount, description } = JSON.parse(await req.text());

    const transaction = await prismaClient.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction)
      return new Response("Transaction not found", { status: 404 });

    const updatedTransaction = await prismaClient.transaction.update({
      where: { id: transactionId },
      data: {
        amount,
        description,
        balanceAfter: transaction.balanceBefore + amount,
      },
    });

    const updatedMember = await prismaClient.member.update({
      where: {
        id: transaction.memberId,
      },
      data: {
        balance: transaction.balanceBefore + amount,
      },
    });

    return Response.json({ status: 200, updatedTransaction, updatedMember });
  } catch (error) {
    return new Response(`Error updating transaction: ${error}`, {
      status: 500,
    });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    const transaction = await prismaClient.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction)
      return new Response("Transaction not found", { status: 404 });

    const updatedTransaction = await prismaClient.transaction.update({
      where: { id: transactionId },
      data: {
        amount: {
          decrement: transaction.amount,
        },
      },
    });

    const admin = await prismaClient.adminAccount.findUnique({
      where: { id: transaction.adminId },
      select: { transactions: true },
    });

    const newTransactionList = admin?.transactions.filter(
      (transaction) => transaction.id !== transactionId
    );

    const updatedAdmin = await prismaClient.adminAccount.update({
      where: { id: transaction.adminId },
      data: { transactions: { set: newTransactionList } },
    });

    return Response.json({ status: 200, updatedTransaction, updatedAdmin });
  } catch (error) {
    return new Response(`Error deleting transaction: ${error}`, {
      status: 500,
    });
  }
}
