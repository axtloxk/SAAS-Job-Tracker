import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, message: "Login in to continue." },
      { status: 401 },
    );
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}
