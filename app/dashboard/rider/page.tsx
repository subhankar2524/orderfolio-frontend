'use client'
import { getUser, logout } from "@/lib/auth";
import { getRiderShipments, updateShipmentStatus } from "@/lib/api";
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

const STATUS_OPTIONS = [
  "created",
  "picked",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export default function RiderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentUser = getUser();

    if (!token || !currentUser || currentUser.role !== "rider") return;

    (async () => {
      try {
        const data = await getRiderShipments(token);
        setShipments(data.shipments || []);
      } catch (err: any) {
        setError(err.message || "Failed to load assigned shipments");
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

  if(user.role!== 'rider'){
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

  const handleStatusChange = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setUpdatingId(id);
    try {
      const data = await updateShipmentStatus(token, id, status);
      const updated = data.shipment as Shipment;
      setShipments((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update shipment");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
  <div className="min-h-screen p-10 flex justify-center bg-black text-white">
    <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Rider Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            Orders assigned to you
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {shipments.length === 0 ? (
        <div className="text-center text-zinc-400 py-20">
          No assigned shipments found
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg">

          <table className="w-full text-sm">

            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="text-left px-4 py-3">AWB</th>
                <th className="text-left px-4 py-3">Delivery Address</th>
                <th className="text-left px-4 py-3">Receiver</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Update</th>
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
                    {s.receiverEmail}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-md bg-zinc-800 text-xs capitalize">
                      {s.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      defaultValue={s.status}
                      onChange={(e) =>
                        handleStatusChange(s._id, e.target.value)
                      }
                      disabled={updatingId === s._id}
                      className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.replace("_", " ")}
                        </option>
                      ))}
                    </select>
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
