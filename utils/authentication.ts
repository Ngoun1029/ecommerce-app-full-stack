import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// const authHeader = request.headers.get("authorization");

// if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// }

// const token = authHeader.split(" ")[1];

// // 2. Verify token
// const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//   id: number;
// };

// const user = await prisma.users.findUnique({
//   where: { id: decoded.id },
//   select: {
//     id: true,
//     name: true,
//     email: true,
//     image: true,
//     createdAt: true,
//   },
// });

export async function authentication(authHeader: string){
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return Response.json({ status  : "error", message: "Unauthorized"}, {status: 401});

    const token = authHeader.split(" ")[1];
    
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
    }

    const user = await prisma.users.findUnique({
        where: {id: decode.id}
    });
}