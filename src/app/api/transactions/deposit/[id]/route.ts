import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prismaClient.transaction.findUnique({
      where: { id: Number(id) },
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
