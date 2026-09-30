import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

export function Reveal({ children, className, as: Tag = "div" }: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
