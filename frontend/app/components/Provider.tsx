"use client";
import { SessionProvider } from "next-auth/react";
import Header from "./Header";
import { NotificationProvider } from "./Notification";
import { ImageKitProvider } from "imagekitio-next";

const urlEndpoint =  process.env.NEXT_PUBLIC_URL_ENDPOINT!;  

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          <div className="min-h-screen bg-base-200">
            <Header />
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}

