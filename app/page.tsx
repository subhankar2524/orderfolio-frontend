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
        <h1>Welcome to OrderFolio</h1>
        <p>You are not logged in.</p>
        <Link href="/login">Login</Link>
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
          <Link href="/dashboard/user">Go to User Dashboard</Link>
        )}
        {user.role === "rider" && (
          <Link href="/dashboard/rider">Go to Rider Dashboard</Link>
        )}
        {user.role === "admin" && (
          <Link href="/dashboard/admin">Go to Admin Dashboard</Link>
        )}
      </div>
    </div>
  );
}
