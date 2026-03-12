"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);

      // store token
      localStorage.setItem("token", data.token);

      // store user object
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user.role;

      if (role === "user") router.push("/dashboard/user");
      if (role === "rider") router.push("/dashboard/rider");
      if (role === "admin") router.push("/dashboard/admin");

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-zinc-400 text-sm">
          Access your OrderFolio account
        </p>
      </div>

      <div className="space-y-4">

        <input
          type="email"
          placeholder="Email"
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

      <div className="mt-6 text-center">
        <Link
          href="/login/admin"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Admin Login
        </Link>
      </div>

    </div>
  </div>
);
}
