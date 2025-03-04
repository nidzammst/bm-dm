import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const member = await prismaClient.member.findFirst({
      where: {
        id: userId,
      },
    });
    if (!member) {
      return new Response("Member not found", { status: 404 });
    } else {
      return Response.json({ status: 200, member });
    }
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest, {params}: {params: Promise<{userId:string}>}){
  try {
    const {userId} = await params

    
  } catch (error) {
    
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const isMemberExist = await prismaClient.member.findFirst({
      where: { id: userId },
    });

    if (!isMemberExist) {
      return new Response("Member not found", { status: 404 });
    }

    const deletedMember = await prismaClient.member.delete({
      where: { id: userId },
    });

    return Response.json({ status: 200, deletedMember });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
