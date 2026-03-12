'use client'
import { getUser } from "@/lib/auth";
import { createShipment, getAllShipments } from "@/lib/api";
import Link from "next/link";
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

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Create shipments and review all shipments.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 20, padding: 16, border: "1px solid #eee" }}>
        <h2>Create Shipment</h2>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="AWB Number"
            value={awbNumber}
            onChange={(e) => setAwbNumber(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Rider Email"
            value={riderEmail}
            onChange={(e) => setRiderEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={handleCreateShipment} disabled={creating}>
            {creating ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>All Shipments</h2>

        {shipments.length === 0 ? (
          <p>No shipments found.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>AWB</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Delivery Address</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Receiver</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Rider</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.awbNumber}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.deliveryAddress}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.receiverEmail}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.riderEmail}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{s.status}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
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
