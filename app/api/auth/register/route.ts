import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || password) {
      return NextResponse.json(
        { error: "Email and password are required " },
        { status: 400 }
      );
    }

    const existingUser = await connectToDatabase();
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    await User.create({
      email, password
    })

    return NextResponse.json(
      { message: "Userregistered succesfullly" },
      { status: 400 }
    );



    await User.findOne({ email })
  } catch (error) {
    console.error("Registration error", error)
    return NextResponse.json(
      { error: "Failed to register User" },
      { status: 400 }
    );
  }
}