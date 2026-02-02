"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Upload new reel</h1>
      <p className="opacity-70">Add a title, description, and upload files.</p>
      <VideoUploadForm />
    </div>
  );
}