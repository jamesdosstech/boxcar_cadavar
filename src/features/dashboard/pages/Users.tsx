import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "../../../utils/firebase/firebase.utils";
import "./Users.styles.scss";

type DbUser = {
  id: string; // doc id == uid
  displayName: string | null;
  email: string | null;
  createdAt: Date | null;
};

const toDate = (v: unknown): Date | null => {
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return null;
};

const fmtDate = (d: Date | null) =>
  d
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(d)
    : "—";

export default function Users() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, orderBy("createdAt", "desc"));
      const snapshots = await getDocs(q);

      const documents: DbUser[] = snapshots.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return {
          id: docSnap.id,
          displayName: (data.displayName as string) ?? null,
          email: (data.email as string) ?? null,
          createdAt: toDate(data.createdAt),
        };
      });

      setUsers(documents);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const name = (u.displayName ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const id = (u.id ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || id.includes(q);
    });
  }, [users, search]);

  return (
    <section className="ds-users">
      <header className="ds-users-header">
        <div>
          <h2 className="ds-users-title">Users</h2>
          <p className="ds-users-subtitle">All accounts registered in Firestore.</p>
        </div>

        <div className="ds-users-actions">
          <input
            className="ds-users-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or uid…"
          />
          <div className="ds-users-count">
            {filtered.length} user{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </header>

      {loading ? (
        <p className="ds-muted">Loading users…</p>
      ) : error ? (
        <div className="ds-error" role="alert">{error}</div>
      ) : filtered.length === 0 ? (
        <p className="ds-muted">No users found.</p>
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th scope="col">Display Name</th>
                <th scope="col">Email</th>
                <th scope="col">UID</th>
                <th scope="col">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="ds-strong">{u.displayName ?? "—"}</td>
                  <td>{u.email ?? "—"}</td>
                  <td className="ds-mono">{u.id}</td>
                  <td>{fmtDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
