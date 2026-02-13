import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../../lib/find";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const orders = await findOneWithRelations(
      "orders",
      Number((await params).id),
      "id",
      {
        orderItem: {
          include: {
            product: true,
          },
        },
      },
      true,
    );

    const formattedData = {
      ...orders,
      orderItem: orders.orderItem.map((item: any) => {
        const firstImage =
          item.product.image &&
          Object.values(item.product.image as Record<string, string>).length > 0
            ? Object.values(item.product.image as Record<string, string>)[0]
            : null;

        return {
          ...item,
          product: {
            ...item.product,
            image: firstImage,
          },
        };
      }),
    };

    return Response.json(
      {
        status: "success",
        data: formattedData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
