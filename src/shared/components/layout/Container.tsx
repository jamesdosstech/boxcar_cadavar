import React from "react";
import "./layout.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return <div className={`ds-container ${className}`}>{children}</div>;
}
