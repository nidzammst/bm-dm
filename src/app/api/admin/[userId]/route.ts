import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const adminAccount = await prismaClient.adminAccount.findUnique({
      where: {
        id: userId,
      },
    });

    if (!adminAccount) {
      return new Response("Admin Account not found", { status: 404 });
    }

    return Response.json({ status: 200, adminAccount });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const { name } = JSON.parse(await req.text());
    const updatedData = Validation.validate(UserValidation.UPDATE, {
      name,
    });

    const updatedAdmin = await prismaClient.adminAccount.update({
      where: { id: userId },
      data: {
        name: updatedData.name,
      },
    });

    if (!updatedAdmin)
      return new Response("Admin Account not found", { status: 404 });

    return Response.json({ status: 200, updatedAdmin });
  } catch (error) {
    logger.error(`Failed to update admin account: ${error}`);
    return new Response(`Validation error: ${error}`, {
      status: 400,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const isAdminExist = await prismaClient.adminAccount.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isAdminExist) {
      return new Response("Admin Account not found", { status: 404 });
    }

    const deletedAccount = await prismaClient.adminAccount.delete({
      where: {
        id: userId,
      },
    });

    return Response.json({ status: 200, deletedAccount });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
