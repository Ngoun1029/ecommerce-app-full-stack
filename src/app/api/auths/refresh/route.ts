import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  let refreshToken: string | undefined;
  let isWeb = false;

  // 1️⃣ Try cookie first (web)
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("refresh_token")?.value;

  if (cookieToken) {
    refreshToken = cookieToken;
    isWeb = true;
  } else {
    // 2️⃣ Try request body (mobile)
    try {
      const body = await request.json();
      refreshToken = body.refreshToken ?? body.refresh_token;
    } catch {
      // not JSON or empty body
    }

    // 3️⃣ Try Authorization header (mobile fallback)
    if (!refreshToken) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        refreshToken = authHeader.substring(7);
      }
    }
  }

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // 4️⃣ Verify refresh token
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

    // 5️⃣ Issue new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    // 6️⃣ Issue new refresh token (rotation)
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "30d" },
    );

    // 7️⃣ Set cookie only for web clients
    if (isWeb) {
      cookieStore.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            role: user.role.name,
          },
          accessToken,
          // Mobile reads this from body, web uses cookie instead
          ...(isWeb ? {} : { refreshToken: newRefreshToken }),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
