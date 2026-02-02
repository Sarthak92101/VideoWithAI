"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { VideoDTO } from "@/lib/video-types";
import VideoFeed from "./VideoFeed";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomeClient() {
  const { status } = useSession();
  const [videos, setVideos] = useState<VideoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiClient.getVideos();
        if (mounted) setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Failed to load videos");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Video with AI</h1>
          <p className="opacity-70">
            Upload short videos and browse the latest reels.
          </p>
          <div className="flex gap-2">
            {status === "authenticated" ? (
              <Link href="/uploads" className="btn btn-primary">
                Upload a video
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-ghost">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">Loading videos…</div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && <VideoFeed videos={videos} />}
    </div>
  );
}

