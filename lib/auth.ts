// lib/auth.ts
import { prisma } from "./prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * Protect API route and return the authenticated user
 * @param req - Next.js Request
 * @param requireAdmin - optional, enforce admin role
 */
export async function protectRoute(req: Request, requireAdmin = false) {
  try {
    // 1️⃣ Get token from Authorization header or cookie
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "") || null;

    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // 2️⃣ Verify access token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 3️⃣ Fetch user + role
    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      include: { role: true }, // relational data
    });

    if (!user) {
      return { error: "User not found", status: 401 };
    }

    // 4️⃣ Optionally check for admin role
    if (requireAdmin && user.role.name !== "Admin") {
      return { error: "Forbidden", status: 403 };
    }

    return { user }; // return user object to the route
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
