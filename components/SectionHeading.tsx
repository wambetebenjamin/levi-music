import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  white = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  white?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`section-heading ${align === "left" ? "levi-left" : ""} ${white ? "white" : ""}`}
    >
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
      {children}
    </div>
  );
}
