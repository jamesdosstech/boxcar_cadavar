type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <div className="ds-stat-card">
      <div className="ds-stat-card-label">{title}</div>
      <div className="ds-stat-card-value">{value}</div>
      {subtitle && <div className="ds-stat-card-sub">{subtitle}</div>}
    </div>
  );
}
