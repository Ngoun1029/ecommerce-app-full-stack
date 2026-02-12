import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../../../lib/prisma";
import { ShippingRequest } from "@/app/types/request/ShippingRequest";

export async function POST(request: Request) {
  try {
    const body: ShippingRequest = await request.json();
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

    const check = await prisma.shippings.findFirst({
      where: { userId: user.id },
    });

    if (check)
      return Response.json(
        { status: "error", message: "Already Create" },
        { status: 400 },
      );

    await prisma.shippings.create({
      data: {
        userId: user.id,
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        stats: body.state,
        countryCode: body.countryCode,
        postalCode: body.postalCode,
      },
    });

    return Response.json(
      {
        status: "success",
        message: "Shipping address created successfully",
      },
      {
        status: 200,
      },
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
