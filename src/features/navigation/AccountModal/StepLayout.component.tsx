import React from "react";
import "./StepLayout.styles.scss";

type Props = {
  children: React.ReactNode;
};

export default function StepLayout({ children }: Props) {
  return <div className="ds-step">{children}</div>;
}
