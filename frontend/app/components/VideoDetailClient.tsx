"use client";

import type { VideoDTO } from "@/lib/video-types";
import { IKVideo } from "imagekitio-next";

export default function VideoDetailClient({ video }: { video: VideoDTO }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body gap-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="opacity-70">{video.description}</p>

        <div className="rounded-xl overflow-hidden bg-base-200">
          <div className="w-full" style={{ aspectRatio: "9/16" }}>
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls ?? true}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

