'use client'
import { getUser, logout } from "@/lib/auth";
import { getUserShipments } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Shipment = {
  _id: string;
  awbNumber: string;
  deliveryAddress: string;
  receiverEmail: string;
  riderEmail: string;
  status: string;
  createdAt: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentUser = getUser();

    if (!token || !currentUser || currentUser.role !== "user") return;

    (async () => {
      try {
        const data = await getUserShipments(token);
        setShipments(data.shipments || []);
      } catch (err: any) {
        setError(err.message || "Failed to load shipments");
      }
    })();
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

  if(user.role!== 'user'){
    return (
      <div style={{ padding: 40 }}>
        <div style={{ marginTop: 20 }}>
            <Link href="/dashboard/user">You are not allowed to visit this link</Link>
        </div>
    </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
  <div className="min-h-screen p-10 flex justify-center bg-black text-white">
    <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">User Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            Here are your shipments
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {shipments.length === 0 ? (
        <div className="text-center text-zinc-400 py-20">
          No shipments found
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg">

          <table className="w-full text-sm">

            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="text-left px-4 py-3">AWB</th>
                <th className="text-left px-4 py-3">Delivery Address</th>
                <th className="text-left px-4 py-3">Rider</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {s.awbNumber}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {s.deliveryAddress}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {s.riderEmail}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-md bg-zinc-800 text-xs capitalize">
                      {s.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  </div>
);
}
