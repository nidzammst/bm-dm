import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { DepositeValidation } from "@/lib/validation/deposit-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const { amount, description, admin } = JSON.parse(await req.text());

    const data = Validation.validate(DepositeValidation.ADD, {
      amount,
      admin,
      description,
    });
    const isMemberExist = await prismaClient.member.findFirst({
      where: { username },
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    /* Buat transaksi tambah saldo */
    const depositTransaction = await prismaClient.transaction.create({
      data: {
        type: "DEPOSIT",
        description: data.description,
        amount: data.amount,
        balanceBefore: isMemberExist.balance,
        balanceAfter: isMemberExist.balance + amount,
        member: { connect: { username } },
        admin: { connect: { username: data.admin } },
      },
    });

    /* Perbarui member yang menambah saldo */
    const updatedMember = await prismaClient.member.update({
      where: { username: isMemberExist.username },
      data: {
        balance: isMemberExist.balance + amount,
        currentTransaction: { set: { id: depositTransaction.id } },
      },
    });

    /* tambahkan transaksi tambah saldo ke akun admin */
    const updatedAdmin = await prismaClient.adminAccount.update({
      where: { username: data.admin },
      data: {
        transactions: { connect: { id: depositTransaction.id } },
      },
    });

    return Response.json({
      status: 201,
      depositTransaction,
      updatedMember,
      updatedAdmin,
    });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const searchParams = req.nextUrl.searchParams;

    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    const skip = Number(limit) * (Number(page) - 1);
    const isMemberExist = await prismaClient.member.findFirst({
      where: { username },
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const transactions = await prismaClient.transaction.findMany({
      where: {
        member: {
          username: isMemberExist.username,
        },
      },
      skip,
      take: Number(limit),
    });

    return Response.json({ status: 200, transactions });
  } catch (error) {
    logger.error(`Error fetching data : ${error}`);
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { transactionId, amount, description } = JSON.parse(await req.text());

    const data = Validation.validate(DepositeValidation.UPDATE, {
      id: Number(transactionId),
      amount: Number(amount),
      description,
      username,
    });

    const isMemberExist = await prismaClient.member.findUnique({
      where: { username: data.username },
      include: { currentTransaction: true },
    });

    if (!isMemberExist)
      return new Response("Member not found", { status: 404 });

    const isCurrentTransaction =
      isMemberExist.currentTransaction[0].id === data.id;

    if (!isCurrentTransaction)
      return new Response("Transaction cannot be changed", { status: 404 });

    const currentTransaction = await prismaClient.transaction.findFirst({
      where: { id: data.id },
    });

    const updatedTransaction = await prismaClient.transaction.update({
      where: {
        id: data.id,
      },
      data: {
        amount,
        description,
        balanceAfter: currentTransaction?.balanceBefore + amount,
      },
    });

    const updatedMember = await prismaClient.member.update({
      where: { username: data.username },
      data: {
        balance: updatedTransaction.balanceAfter,
      },
    });

    return Response.json({ status: 200, updatedTransaction, updatedMember });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const { transactionId } = JSON.parse(await req.text());

    const data = Validation.validate(DepositeValidation.DELETE, {
      id: Number(transactionId),
      username,
    });

    /* cek apakah member ada */
    const isMemberExist = await prismaClient.member.findUnique({
      where: { username },
      include: { currentTransaction: true },
    });

    if (!isMemberExist)
      return new Response(`Member ${username} does not exist`, { status: 404 });

    /* cek apakah transaksi yang akan di hapus ada di currentTransaction */
    const isCurrentTransaction =
      isMemberExist.currentTransaction[0].id === transactionId;

    if (!isCurrentTransaction)
      return new Response(
        `Transacrion with ID ${transactionId} cannot be changed`,
        { status: 404 }
      );

    /* update saldo member */
    const updatedMember = await prismaClient.member.update({
      where: { username: isMemberExist.username },
      data: {
        balance: isMemberExist.currentTransaction[0].balanceBefore,
      },
    });

    /* hapus transaksi */
    const deletedTransaction = await prismaClient.transaction.delete({
      where: { id: data.id },
    });

    return Response.json({ status: 200, deletedTransaction, updatedMember });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
