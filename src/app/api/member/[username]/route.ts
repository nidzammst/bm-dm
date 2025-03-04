import { prismaClient } from "@/lib/application/database";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const member = await prismaClient.member.findFirst({
      where: {
        username,
      },
      include: {
        currentTransaction: true,
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const { name } = JSON.parse(await req.text());

    const data = Validation.validate(UserValidation.UPDATE, { name });

    const updatedMember = await prismaClient.member.update({
      where: {
        username,
      },
      data: { name: data.name },
    });

    if (!updatedMember)
      return new Response(`Member not found`, { status: 404 });

    return Response.json({ status: 200, updatedMember });
  } catch (error) {
    return new Response(`Validation error: ${error}`, {
      status: 400,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const isMemberExist = await prismaClient.member.findFirst({
      where: { username },
    });

    if (!isMemberExist) {
      return new Response("Member not found", { status: 404 });
    }

    const deletedMember = await prismaClient.member.delete({
      where: { username },
    });

    return Response.json({ status: 200, deletedMember });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
