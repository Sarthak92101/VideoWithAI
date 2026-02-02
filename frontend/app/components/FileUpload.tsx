"use client";

import {
  upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: unknown) => void;
  onProgress?: (progress: number) => void;
  filetype?: "image" | "video";
}

const FileUpload = ({
  onSuccess,
  onProgress,
  filetype
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File) => {
    if (filetype === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
    }
    if (filetype === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateFile(file)) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) {
        throw new Error(await authRes.text());
      }
      const auth = await authRes.json();

      const params = auth?.authenticationParameter;
      if (!params?.signature || !params?.token || !params?.expire) {
        throw new Error("Invalid ImageKit auth response");
      }

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: auth?.publicKey ?? process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: params.signature,
        expire: params.expire,
        token: params.token,

        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },

      });
      onSuccess(res);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
    }
  };


  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={filetype === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
      />
      {uploading && (
        <div className="mt-2 text-sm opacity-70">Uploading…</div>
      )}
      {error && <div className="mt-2 text-sm text-error">{error}</div>}
    </>
  );
};



export default FileUpload;