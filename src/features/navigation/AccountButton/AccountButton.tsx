import { User } from "firebase/auth";
import React from "react";

type Props = {
  label: string;
  onClick: () => void;
};

export default function AccountButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      className="ds-nav-link ds-nav-button"
      onClick={onClick}
      style={{ textAlign: "left" }}
    >
      {label}
    </button>
  );
}
