'use client'
import { getUser, logout } from "@/lib/auth";
import { createShipment, getAllShipments } from "@/lib/api";
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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [awbNumber, setAwbNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentUser = getUser();

    if (!token || !currentUser || currentUser.role !== "admin") return;

    (async () => {
      try {
        const data = await getAllShipments(token);
        setShipments(data.shipments || []);
      } catch (err: any) {
        setError(err.message || "Failed to load shipments");
      }
    })();
  }, []);

  const handleCreateShipment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCreating(true);
    setError(null);

    try {
      const data = await createShipment(token, {
        awbNumber,
        deliveryAddress,
        receiverEmail,
        riderEmail,
      });

      const newShipment = data.shipment as Shipment;
      setShipments((prev) => [newShipment, ...prev]);

      setAwbNumber("");
      setDeliveryAddress("");
      setReceiverEmail("");
      setRiderEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Welcome to OrderFolio</h1>
        <p>You are not logged in.</p>
        <Link href="/login/admin">Admin Login</Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ marginTop: 20 }}>
          <Link href="/">You are not allowed to visit this link</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login/admin");
  };

  return (
  <div className="min-h-screen p-10 flex justify-center bg-black text-white">
    <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            Create shipments and review all shipments
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

      {/* Create Shipment */}
      <div className="border border-zinc-800 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Create Shipment</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="AWB Number"
            value={awbNumber}
            onChange={(e) => setAwbNumber(e.target.value)}
          />

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
          />

          <input
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="Rider Email"
            value={riderEmail}
            onChange={(e) => setRiderEmail(e.target.value)}
          />

        </div>

        <button
          onClick={handleCreateShipment}
          disabled={creating}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          {creating ? "Creating..." : "Create Shipment"}
        </button>
      </div>

      {/* Shipments Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Shipments</h2>

        {shipments.length === 0 ? (
          <div className="text-center text-zinc-400 py-16">
            No shipments found
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-800 rounded-lg">

            <table className="w-full text-sm">

              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th className="text-left px-4 py-3">AWB</th>
                  <th className="text-left px-4 py-3">Delivery Address</th>
                  <th className="text-left px-4 py-3">Receiver</th>
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
                      {s.receiverEmail}
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
  </div>
);
}
