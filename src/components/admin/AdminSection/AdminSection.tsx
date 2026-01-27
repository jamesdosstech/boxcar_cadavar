import { ReactNode } from "react";
import "./AdminSection.styles.scss";

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminSection({ title, subtitle, actions, children }: Props) {
  return (
    <section className="ds-admin-section">
      <header className="ds-admin-section-header">
        <div className="ds-admin-section-title">
          <h2>{title}</h2>
          {subtitle ? <p className="ds-admin-section-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="ds-admin-section-actions">{actions}</div> : null}
      </header>

      <div className="ds-admin-section-body">{children}</div>
    </section>
  );
}
