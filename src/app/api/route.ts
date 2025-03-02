import { prismaClient } from "@/lib/application/database";

export async function GET() {
  try {
    const data = await prismaClient.adminAccount.delete({
      where: {
        id: "b61bf1c6-78d3-4288-87ee-47014ff24f0a",
      },
    });

    return Response.json(data);
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
