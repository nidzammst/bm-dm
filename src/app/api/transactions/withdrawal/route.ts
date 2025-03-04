import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { limit, page } = JSON.parse(await req.text());
    const skip = limit * page - 1;

    const transactions = await prismaClient.transaction.findMany({
      where: {
        type: "WITHDRAWAL",
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ status: 200, transactions });
  } catch (error) {
    return new Response(`Error fetching transactions: ${error}`, {
      status: 500,
    });
  }
}
