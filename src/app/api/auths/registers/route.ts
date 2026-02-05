import { RegisterRequest } from "@/app/types/RegisterRequest";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../lib/find";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegisterRequest = await request.json();
    const roleAsUser = await findOneWithRelations('roles', 'user', 'name', {}, true);
    if(!roleAsUser){
        await prisma.products.create({
            data: {
                name: 'user',
            }
        });
    }
    // await prisma.users.create({
    //     // data: {
    //     //     name: body.name.trimEnd(),
    //     //     email: body.email.trimEnd(),
    //     //     password: body.password,
    //     //     // image: body.image,
    //     //     // roleId: ,
    //     // }
    // });
    

    return NextResponse.json({
        status: "success",
        message: "User registered successfully",
        
    }, {
        status: 201,
    }); 


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
