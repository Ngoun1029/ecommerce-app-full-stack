import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export async function middleware(req: NextRequest) {
  try {
    // ✅ Public routes
    const publicPaths = ["/api/auths/logins", "/api/auths/registers"];
    if (publicPaths.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // 1️⃣ Get token from cookie
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 3️⃣ Fetch user + role
    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // 4️⃣ Optional role-based example: block non-admin from roles route
    if (
      req.nextUrl.pathname.startsWith("/api/roles") &&
      user.role.name !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 5️⃣ Pass user info to the route via headers
    const res = NextResponse.next();
    res.headers.set("x-user-id", user.id.toString());
    res.headers.set("x-user-email", user.email);
    res.headers.set("x-user-role", user.role.name);

    return res;
  } catch (err) {
    console.error("Middleware auth error:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

// 6️⃣ Apply middleware to ALL API routes
export const config = {
  matcher: ["/api/:path*"],
  runtime: "nodejs",
};
