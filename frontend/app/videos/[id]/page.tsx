import Link from "next/link";
import type { VideoDTO } from "@/lib/video-types";
import VideoDetailClient from "@/app/components/VideoDetailClient";

export default async function VideoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Note: ApiClient uses fetch("/api/...") which is browser-relative.
  // For server components, use direct fetch to the API route.
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/video/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-xl font-bold">Video not found</h1>
          <Link className="btn btn-ghost w-fit" href="/">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const video = (await res.json()) as VideoDTO;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link className="btn btn-ghost" href="/">
          ← Back
        </Link>
      </div>

      <VideoDetailClient video={video} />
    </div>
  );
}

