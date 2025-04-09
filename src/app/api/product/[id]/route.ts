import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyToken(req);

    const deleted = await client.product.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return Response.json({ msg: "Deleted", deleted });
  } catch (err) {
    return Response.json({ msg: "Not Found" }, { status: 401 });
  }
}
