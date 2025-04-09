import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password, authType } = body;

    try {
        if (authType === "Signup") {
            const existingUser = await client.user.findUnique({ where: { email } });
            if (existingUser) {
                return Response.json({ msg: "User already exists" }, { status: 409 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await client.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            return Response.json({ msg: "User created successfully" }, { status: 201 });

        } else if (authType === "Signin") {
            const user = await client.user.findUnique({ where: { email } });

            if (!user) {
                return Response.json({ msg: "User not found" }, { status: 404 });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return Response.json({ msg: "Wrong password" }, { status: 401 });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            return Response.json({ msg: "Login successful", token }, { status: 200 });
        }

        return Response.json({ msg: "Error" }, { status: 400 });

    } catch (err) {
        console.error("Error:", err);
        return Response.json({ msg: "Error" }, { status: 500 });
    }
}
