export type VideoId = string;

export type VideoDTO = {
  _id?: VideoId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type VideoCreateInput = Omit<VideoDTO, "_id" | "createdAt" | "updatedAt">;

