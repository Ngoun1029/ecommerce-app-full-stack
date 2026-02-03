import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Create response
  const res = NextResponse.json(
    { status: "success", message: "Logged out successfully" },
    { status: 200 },
  );

  // Clear the refresh_token cookie
  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return res;
}
