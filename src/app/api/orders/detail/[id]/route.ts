import { NextRequest, NextResponse } from "next/server";
import { findOneWithRelations } from "../../../../../../lib/find";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
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

    return NextResponse.json(
      {
        status: "success",
        data: formattedData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
