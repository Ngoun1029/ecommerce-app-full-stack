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

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    // Set cookie
    const cookie = serialize("access_token", accessToken, {
      httpOnly: true, // not accessible via JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    const loginData = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      role: user.role.name || null,
    };

    // Return response with cookie
    const res = NextResponse.json(
      {
        status: "success",
        message: "Logged in successfully",
        data: { user: loginData },
        accessToken: accessToken,
      },
      { status: 200 },
    );
    res.headers.set("Set-Cookie", cookie);

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
