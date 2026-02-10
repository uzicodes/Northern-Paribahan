import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // For demo purposes, creating user if not exists or just checking password
        // In real app, separate login/register

        // NOTE: This is a placeholder auth for 'login'. 
        // IF user doesn't exist, we might return error.

        if (!user) {
            // Create a dummy user for testing if not found (AUTO REGISTER for simpler demo)
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: email.split("@")[0],
                    role: "USER"
                }
            });
            const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });
            return NextResponse.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
