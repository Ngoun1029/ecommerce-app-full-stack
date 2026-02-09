import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    // Check if role exists
    const exists = await prisma.roles.findUnique({ where: { name } });
    if (exists) {
      return new Response(
        JSON.stringify({ status: "error", message: "Role already exists" }),
        { status: 400 },
      );
    }

    // Create new role
    const role = await prisma.roles.create({
      data: { name },
    });

    return new Response(JSON.stringify({ status: "success", role }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ status: "error", message: "Something went wrong" }),
      { status: 500 },
    );
  }
}
