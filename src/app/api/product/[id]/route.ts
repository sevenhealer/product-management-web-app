import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET);
}

export async function DELETE(req: NextRequest) {
  try {
    verifyToken(req);

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) return NextResponse.json({ msg: "No ID provided" }, { status: 400 });

    const deleted = await client.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ msg: "Deleted", deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Unauthorized or Not Found" }, { status: 401 });
  }
}
