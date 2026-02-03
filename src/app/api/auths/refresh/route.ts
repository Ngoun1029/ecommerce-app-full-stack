import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../../lib/prisma"; // make sure this points to your Prisma client

export async function POST() {
  // 1️⃣ Get refresh token from cookie
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // 2️⃣ Verify refresh token
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as any;

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4️⃣ Issue new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    // 5️⃣ Build login data
    const loginData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    };

    return NextResponse.json(
      {
        status: "success",
        data: {
          user: loginData,
          accessToken,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
