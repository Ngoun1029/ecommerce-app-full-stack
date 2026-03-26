import { OrderRequest } from "@/app/types/request/OrderRequest";
import { prisma } from "../../../../../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findOneWithRelations } from "../../../../../lib/find";
import { generateOrderCode } from "../../../../../utils/generatedCode";
import { PaymentStatus } from "@/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json();
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

    const shipping = await findOneWithRelations(
      "shippings",
      user.id,
      "userId",
      {},
      true,
    );

    // ✅ Single order creation inside the transaction only
    await prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          orderCode: generateOrderCode(),
          userId: user.id,
          shippingId: shipping.id,
          paymentMethod: body.paymentMethod,
          promotionCode: body.promotionCode ?? "",
          totalAmount: 0,
          // ✅ PAID for card (Stripe already charged), UNPAID for cash
          paymentStatus:
            body.paymentMethod.toLowerCase() === "card"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
        },
      });

      let totalAmount = 0;

      for (const item of body.order_items) {
        const product = await tx.products.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }

        const subTotal = Number(product.price) * Number(item.quantity);
        totalAmount += subTotal;

        await tx.orderItems.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: Number(product.price),
            subTotal: subTotal,
          },
        });
      }

      await tx.orders.update({
        where: { id: order.id },
        data: { totalAmount },
      });

      return order;
    });

    return Response.json(
      { status: "success", message: "Order created successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.log(error);
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}