import type { VideoCreateInput, VideoDTO } from "./video-types";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<VideoDTO[]>("/video");
  }

  async createVideo(videoData: VideoCreateInput) {
    return this.fetch<VideoDTO>("/video", {
      method: "POST",
      body: videoData,
    });
  }

  async getVideoById(id: string) {
    return this.fetch<VideoDTO>(`/video/${encodeURIComponent(id)}`);
  }
}

export const apiClient = new ApiClient();