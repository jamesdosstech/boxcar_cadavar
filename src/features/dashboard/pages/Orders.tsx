import { useEffect, useState } from "react";
import AdminSection from "../../../components/admin/AdminSection/AdminSection";
import { getRecentOrders, type Order } from "../../../utils/firebase/firebase.utils";

type OrderRow = Order; // reuse your typed Order from firebase.utils

const money = (cents: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((Number(cents) || 0) / 100);

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getRecentOrders(25); // grab last 25
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError("Failed to load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminSection
      title="Orders"
      subtitle="Track purchases, status, totals, and customer details."
      actions={
        <button disabled className="ds-btn ds-btn-sm ds-btn-ghost" type="button">
          Export
        </button>
      }
    >
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : error ? (
        <p className="ds-error">{error}</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No orders yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ds-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Email</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    {o.createdAt ? o.createdAt.toLocaleString() : "—"}
                  </td>
                  <td style={{ textTransform: "uppercase" }}>{o.status}</td>
                  <td>{o.contact?.name ?? "—"}</td>
                  <td>{o.contact?.email ?? "—"}</td>
                  <td style={{ textAlign: "right", fontWeight: 800 }}>
                    {money(o.totalCents, o.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminSection>
  );
}
