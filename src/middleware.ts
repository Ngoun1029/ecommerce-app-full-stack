// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const publicPaths = [
  "/api/auths/logins",
  "/api/auths/registers",
  "/api/categories/client-view",
  "/api/products/client-view",
  "/api/client-product-home-view",
  "/api/products/client-detail",
  "/api/banners/client-view",
  "/api/proxy/image",
  "/api/webhook",                 
  "/api/create-payment-intent",
];

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS", // ← PATCH added
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

function withCors(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([k, v]) =>
    response.headers.set(k, v),
  );
  return response;
}

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { pathname } = req.nextUrl;

    const isPublic = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isPublic) {
      return withCors(NextResponse.next());
    }

    let token: string | undefined;

    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = req.cookies.get("access_token")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders },
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401, headers: corsHeaders },
      );
    }

    if (pathname.startsWith("/api/roles") && user.role.name !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders },
      );
    }

    const res = NextResponse.next();
    res.headers.set("x-user-id",    user.id.toString());
    res.headers.set("x-user-email", user.email);
    res.headers.set("x-user-role",  user.role.name);

    return withCors(res);
  } catch (err) {
    console.error("Middleware auth error:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401, headers: corsHeaders },
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
  runtime: "nodejs",
};