import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: {
      name: string;
      image: string;
      description: string;
      link: string;
    } = await request.json();

    await prisma.banners.create({
      data: {
        name: body.name,
        image: body.image,
        description: body.description,
        link: body.link,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "banner successfully created",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    return NextResponse.json({
      status: "error",
    });
  }
}
