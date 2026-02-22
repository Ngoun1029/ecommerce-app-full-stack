import { RegisterRequest } from "@/app/types/request/RegisterRequest";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../lib/find";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const email = await findOneWithRelations(
      "users",
      body.email,
      "email",
      {},
      true
    );
    if (email)
      return NextResponse.json(
        { status: "error", message: "email already exist" },
        { status: 400 }
      );

    // ✅ FIXED
    let roleAsUser = await findOneWithRelations(
      "roles",
      "user",
      "name",
      {},
      true
    );

    if (!roleAsUser) {
      roleAsUser = await prisma.roles.create({
        data: { name: "user" },
      });
    }

    await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        image: null,
        roleId: roleAsUser.id,
        dob: body.dob,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
