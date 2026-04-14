type ActivityItem = {
  id: string;
  message: string;
  createdAt: string; // keep as string for now; can switch to Date later
  type?: "info" | "success" | "warning" | "danger";
};

type Props = {
  logs: ActivityItem[];
};

export default function ActivityLog({ logs }: Props) {
  return (
    <section className="ds-admin-card" aria-label="Activity log">
      <header className="ds-admin-card-header">
        <h3 className="ds-admin-card-title">Activity</h3>
      </header>

      {logs.length === 0 ? (
        <p className="ds-muted">No recent activity.</p>
      ) : (
        <ul className="ds-activity-list">
          {logs.map((log) => (
            <li key={log.id} className="ds-activity-item">
              <span
                className={`ds-activity-dot ds-activity-dot-${log.type ?? "info"}`}
                aria-hidden="true"
              />
              <div className="ds-activity-content">
                <p className="ds-activity-message">{log.message}</p>
                <p className="ds-activity-date">{log.createdAt}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
