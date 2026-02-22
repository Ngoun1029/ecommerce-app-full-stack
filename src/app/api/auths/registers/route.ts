import { RegisterRequest } from "@/app/types/request/RegisterRequest";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../lib/find";
import { uploadToR2 } from "../../../../../utils/file";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body : RegisterRequest = await request.json()
    // const formData = await request.formData();
    // const name = (formData.get("name") as string)?.trim();
    // const email = (formData.get("email") as string)?.trimEnd();
    // const password = formData.get("password") as string;
    // const dob = formData.get("dob") as string;
    // const imageFile = formData.get("image") as File;

    // if (!name) {
    //   return NextResponse.json(
    //     { status: "error", message: "Name is required" },
    //     { status: 400 },
    //   );
    // }
    // if (!imageFile) {
    //   return NextResponse.json(
    //     { status: "error", message: "Image is required" },
    //     { status: 400 },
    //   );
    // }
    const roleAsUser = await findOneWithRelations(
      "roles",
      "user",
      "name",
      {},
      true,
    );
    if (!roleAsUser) {
      await prisma.roles.create({
        data: {
          name: "user",
        },
      });
    }

    // const imageUrl = await uploadToR2(
    //   {
    //     buffer: Buffer.from(await imageFile.arrayBuffer()),
    //     originalName: imageFile.name,
    //     mimeType: imageFile.type,
    //   },
    //   "users",
    // );

    await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        image: null,
        roleId: roleAsUser.id,
        dob: body.dob,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
