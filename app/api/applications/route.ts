import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

//  fetch the user's username and application to display them in /dashboard
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value; // cookie's name is auth_token and not "token".

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Find the unique user and include their applications
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        username: true,
        applications: {
          orderBy: { appliedAt: "desc" }, // Sort newest first
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

// POST: Save a new application
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { jobTitle, companyName, status, date, applyLink } = await req.json();

    const application = await prisma.application.create({
      data: {
        jobTitle,
        companyName,
        status, // Must match the Prisma Enum
        appliedAt: new Date(date),
        applyLink: applyLink || null,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
