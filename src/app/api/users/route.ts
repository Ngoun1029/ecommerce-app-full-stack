

import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

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
      { status: 500 }
    );
  }
}