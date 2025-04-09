import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET() {
  const products = await client.product.findMany();
  return Response.json(products);
}

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET);
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);
    const body = await req.json();

    const product = await client.product.create({
      data: body,
    });

    return Response.json(product);
  } catch (err) {
    return Response.json({ msg: "Unauthorized or Bad Request" }, { status: 401 });
  }
}
