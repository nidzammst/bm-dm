import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description } = JSON.parse(await req.text());
    const data = await prismaClient.adminAccount.create({
      data: {
        name,
        description,
      },
    });

    return Response.json({ status: 201, data });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
