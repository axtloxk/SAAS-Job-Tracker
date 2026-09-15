import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { email, username, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = signJWT({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: user.id, email: user.email, username: user.username },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
