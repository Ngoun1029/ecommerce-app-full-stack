import { UserRequest } from "@/app/types/UserRequest";
import { NextRequest, NextResponse } from "next/server";
import bcrypt, { compare } from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch users
export async function GET() {
  try {
    const users = await prisma.users.findMany();

    return NextResponse.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: UserRequest = await req.json();
    const emailExists = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (emailExists) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email already exists",
        },
        { status: 400 },
      );
    }
    await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        roleId: body.roleId,
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "User Created Successfully",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
