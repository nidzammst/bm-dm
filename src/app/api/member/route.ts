import { prismaClient } from "@/lib/application/database";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = JSON.parse(await req.text());

    const data = Validation.validate(UserValidation.ADDMEMBER, { name, email });

    const isMemberExist = await prismaClient.member.findFirst({
      where: { email: email },
    });

    if (isMemberExist) {
      return new Response(`Register error : Member already exist`, {
        status: 400,
      });
    }

    const newMember = await prismaClient.member.create({
      data,
    });

    return Response.json({
      status: 201,
      newMember,
    });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    const skip = Number(limit) * (Number(page) - 1);
    
    const members = await prismaClient.member.findMany({
      include: { transactions: true },
      skip,
      take: Number(limit),
    });
    return Response.json({ status: 200, members });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
