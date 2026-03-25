import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { findOneWithRelations } from "../../../../../lib/find";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await findOneWithRelations("users", email, "email", {
      role: true,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const ACCESS_TOKEN_EXPIRY = 60 * 60 * 24;       // 24h in seconds
    const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30; // 30d in seconds

    // ✅ Access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    // ✅ Refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    // ✅ Expiry timestamp for mobile background refresh
    const accessTokenExpiresAt =
      Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY;

    const loginData = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      role: user.role.name || null,
    };

    // ✅ Cookies for web
    const accessCookie = serialize("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRY,
      path: "/",
    });

    const refreshCookie = serialize("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
      path: "/",
    });

    const res = NextResponse.json(
      {
        status: "success",
        message: "Logged in successfully",
        data: {
          user: loginData,
         
        },

         accessToken,
          accessTokenExpiresAt, // ✅ Unix timestamp — mobile stores this
          refreshToken,         // ✅ mobile stores this in SharedPreferencesF
      },
      { status: 200 },
    );

    res.headers.append("Set-Cookie", accessCookie);
    res.headers.append("Set-Cookie", refreshCookie);

    return res;
  } catch (error: unknown) {
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