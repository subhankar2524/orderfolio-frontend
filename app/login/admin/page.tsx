"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "../../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard/admin");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="text-zinc-400 text-sm">
          Access the OrderFolio admin dashboard
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
        >
          Login
        </button>

      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Back to User Login
        </Link>
      </div>

    </div>
  </div>
);
}
