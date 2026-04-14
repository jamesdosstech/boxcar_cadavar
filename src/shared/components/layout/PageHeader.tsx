import React from "react";
import "./layout.scss";

type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="ds-page-header">
      <div>
        <h1 className="ds-h1">{title}</h1>
        {subtitle && <p className="ds-muted">{subtitle}</p>}
      </div>
      {actions && <div className="ds-page-actions">{actions}</div>}
    </div>
  );
}
