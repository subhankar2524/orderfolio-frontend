"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "../lib/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1 className="text-3xl font-bold">Welcome to OrderFolio</h1>
        <p>You are not logged in.</p>
        <Link href="/login" className="inline-flex items-center justify-center mt-5 px-6 py-3 border border-gray-200 text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200 shadow-sm">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <div style={{ marginTop: 20 }}>
        {user.role === "user" && (
          <Link href="/dashboard/user" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-white-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm">
            Go to User Dashboard
          </Link>
        )}
        {user.role === "rider" && (
          <Link href="/dashboard/rider" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-white-600 hover:bg-green-700 transition-colors duration-200 shadow-sm">
            Go to Rider Dashboard
          </Link>
        )}
        {user.role === "admin" && (
          <Link href="/dashboard/admin" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200 shadow-sm">
            Go to Admin Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
