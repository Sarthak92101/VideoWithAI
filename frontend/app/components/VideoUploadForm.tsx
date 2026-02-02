"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FileUpload from "./FileUpload";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "./Notification";

type UploadResult = {
  filePath?: string;
  url?: string;
};

function extractUploadedPath(res: unknown): string {
  if (!res || typeof res !== "object") return "";
  const r = res as UploadResult;
  if (typeof r.filePath === "string" && r.filePath.length > 0) return r.filePath;
  if (typeof r.url === "string" && r.url.length > 0) return r.url;
  return "";
}

function VideoUploadForm() {
  const router = useRouter();
  const { status } = useSession();
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoPath, setVideoPath] = useState<string>("");
  const [thumbnailPath, setThumbnailPath] = useState<string>("");
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [thumbProgress, setThumbProgress] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      videoPath.length > 0 &&
      thumbnailPath.length > 0 &&
      !submitting
    );
  }, [title, description, videoPath, thumbnailPath, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await apiClient.createVideo({
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoPath,
        thumbnailUrl: thumbnailPath,
        controls: true,
        transformation: {
          height: 1920,
          width: 1080,
          quality: 90,
        },
      });
      showNotification("Video created successfully", "success");
      router.push("/");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create video";
      showNotification(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">Loading…</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow">
      <div className="card-body gap-5">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Title</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My first reel"
            maxLength={120}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this video about?"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Video file</span>
            </label>
            <FileUpload
              filetype="video"
              onProgress={setVideoProgress}
              onSuccess={(res: unknown) => {
                const filePath = extractUploadedPath(res);
                if (filePath) setVideoPath(filePath);
                showNotification("Video uploaded", "success");
              }}
            />
            {videoProgress > 0 && videoProgress < 100 && (
              <progress
                className="progress progress-primary w-full mt-2"
                value={videoProgress}
                max={100}
              />
            )}
            {videoPath && (
              <div className="mt-2 text-xs opacity-70 break-all">
                Stored as: {videoPath}
              </div>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Thumbnail image</span>
            </label>
            <FileUpload
              filetype="image"
              onProgress={setThumbProgress}
              onSuccess={(res: unknown) => {
                const filePath = extractUploadedPath(res);
                if (filePath) setThumbnailPath(filePath);
                showNotification("Thumbnail uploaded", "success");
              }}
            />
            {thumbProgress > 0 && thumbProgress < 100 && (
              <progress
                className="progress progress-secondary w-full mt-2"
                value={thumbProgress}
                max={100}
              />
            )}
            {thumbnailPath && (
              <div className="mt-2 text-xs opacity-70 break-all">
                Stored as: {thumbnailPath}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
          >
            {submitting ? "Creating…" : "Create video"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default VideoUploadForm;