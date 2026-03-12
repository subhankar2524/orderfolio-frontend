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

  return(
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>User Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>Here are your shipments.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shipments.length === 0 ? (
        <p>No shipments found.</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>AWB</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Delivery Address</th>
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
  );
}
