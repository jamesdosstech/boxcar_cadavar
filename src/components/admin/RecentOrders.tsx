import type { Order } from "../../utils/firebase/firebase.utils";

type Props = {
  orders: Order[];
  isLoading?: boolean;
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleString();
}

function formatMoney(cents: number, currency: string) {
  const amount = (Number(cents) || 0) / 100;
  return `${amount.toFixed(2)} ${(currency || "usd").toUpperCase()}`;
}

export default function RecentOrders({ orders, isLoading }: Props) {
  return (
    <section className="ds-admin-card">
      <header className="ds-admin-card-header">
        <h3 className="ds-admin-card-title">Recent Orders</h3>
      </header>

      {isLoading ? (
        <p className="ds-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="ds-muted">No recent orders.</p>
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const customer = o.contact.name || o.contact.email || "—";
                return (
                  <tr key={o.id}>
                    <td className="ds-mono">{o.id}</td>
                    <td>{customer}</td>
                    <td>{formatMoney(o.totalCents, o.currency)}</td>
                    <td>
                      <span className={`ds-badge ds-badge-${o.status}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>{formatDate(o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
