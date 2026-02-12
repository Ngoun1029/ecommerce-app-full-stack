import { findOneWithRelations } from "../../../../../lib/find";
import { prisma } from "../../../../../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { status: "error", message: "Authorization header missing" },
        { status: 401 },
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return Response.json(
        { status: "error", message: "Invalid token format" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return Response.json(
        { status: "error", message: "Token expired or invalid" },
        { status: 401 },
      );
    }
    if (!decoded.id) {
      return Response.json(
        { status: "error", message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return Response.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }

    const shippingDetail = await findOneWithRelations(
      "shippings",
      user.id,
      "userId",
      {},
      true,
    );

    return Response.json(
      {
        status: "success",
        data: shippingDetail,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
