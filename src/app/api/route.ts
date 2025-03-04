import { prismaClient } from "@/lib/application/database";

export async function GET() {
  try {
    const newAdminAccount = await prismaClient.adminAccount.create({
      data: {
        name: "Ahmad Nidzam Musthafa",
        email: "nidzam0501@gmail.com",
      },
    });

    const firstMember = await prismaClient.member.create({
      data: {
        name: "tyar",
        email: "tyar@example.com",
      },
    });

    const secondMember = await prismaClient.member.create({
      data: {
        name: "irene",
        email: "irene@example.com",
      },
    });

    const depositTransaction = await prismaClient.transaction.create({
      data: {
        type: "DEPOSIT",
        description: "Deposit from tyar",
        amount: 200000,
        balanceBefore: 0,
        balanceAfter: 200000,
        member: { connect: { id: firstMember.id } },
        admin: { connect: { id: newAdminAccount.id } },
      },
    });

    const withdrawalTransaction = await prismaClient.transaction.create({
      data: {
        type: "WITHDRAWAL",
        description: "Withdrawal from tyar",
        amount: 100000,
        balanceBefore: 200000,
        balanceAfter: 100000,
        admin: { connect: { id: newAdminAccount.id } },
        member: { connect: { id: firstMember.id } },
      },
    });

    const updatedMember = await prismaClient.member.update({
      where: {
        id: firstMember.id,
      },
      data: {
        balance: 100000,
      },
    });

    return Response.json({
      status: 200,
      message: "Just for testing",
      newAdminAccount,
      updatedMember,
      secondMember,
      depositTransaction,
      withdrawalTransaction,
    });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function DELETE() {
  try {
    await prismaClient.$executeRawUnsafe(`
  TRUNCATE TABLE "admin_accounts", "members", "transactions" RESTART IDENTITY CASCADE;
`);

    return Response.json({
      status: 200,
      message: "Just for testing",
    });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
