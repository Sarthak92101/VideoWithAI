"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useNotification } from "../components/Notification";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }
      showNotification("Account created. Please sign in.", "success");
      router.push("/login");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
}
return (
  <div className="flex justify-center">
    <div className="w-full max-w-md card bg-base-100 shadow">
      <div className="card-body">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="opacity-70">Sign up to upload videos.</p>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="text-sm opacity-70 mt-2">
          Already have an account?{" "}
          <Link className="link link-primary" href="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  </div>
)
}

export default RegisterPage
