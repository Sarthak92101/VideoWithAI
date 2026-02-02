import { connectToDatabase } from "@backend/lib/db";
import Video from "@backend/models/Video";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const video = await Video.findById(params.id).lean();
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch {
    return NextResponse.json(
      { error: "Failed to load video" },
      { status: 500 }
    );
  }
}

