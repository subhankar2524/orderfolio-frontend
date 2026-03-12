export const API_URL = "http://localhost:8080/api";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Admin login failed");
  }

  return data;
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getUserShipments(token: string) {
  const res = await fetch(`${API_URL}/shipments/me`, {
    method: "GET",
    headers: authHeaders(token),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load shipments");
  }

  return data;
}

export async function getAllShipments(token: string) {
  const res = await fetch(`${API_URL}/shipments/`, {
    method: "GET",
    headers: authHeaders(token),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load shipments");
  }

  return data;
}

export async function createShipment(
  token: string,
  payload: {
    awbNumber: string;
    deliveryAddress: string;
    receiverEmail: string;
    riderEmail: string;
  }
) {
  const res = await fetch(`${API_URL}/shipments/create`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create shipment");
  }

  return data;
}

export async function getRiderShipments(token: string) {
  const res = await fetch(`${API_URL}/shipments/assigned`, {
    method: "GET",
    headers: authHeaders(token),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load assigned shipments");
  }

  return data;
}

export async function updateShipmentStatus(
  token: string,
  id: string,
  status: string
) {
  const res = await fetch(`${API_URL}/shipments/update/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update shipment");
  }

  return data;
}
