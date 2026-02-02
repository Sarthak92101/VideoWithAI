"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useNotification } from "../components/Notification";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        showNotification(result.error, "error");
        return;
      }

      showNotification("Signed in successfully", "success");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="opacity-70">
            Use your email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <input
              className="input input-bordered w-full"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input input-bordered w-full"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="text-sm opacity-70 mt-2">
            Don&apos;t have an account?{" "}
            <Link className="link link-primary" href="/register">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
