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

  return(
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Rider Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>These are the orders assigned to you.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shipments.length === 0 ? (
        <p>No assigned shipments found.</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>AWB</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Delivery Address</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Receiver</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.awbNumber}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.deliveryAddress}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.receiverEmail}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.status}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                    <select
                      defaultValue={s.status}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                      disabled={updatingId === s._id}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
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
  );
}
