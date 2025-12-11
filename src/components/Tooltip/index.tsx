import type { ReactNode } from "react";
import { Container } from "./tooltip.styles";

type ToolTipProps = {
  direction: "right" | "left";
  children: ReactNode;
  name: string;
};

// Each tooltip will receive a children
// It will be an icon (toolbar items)
// with its name (tooltip content)
function ToolTip({ direction, children, name }: ToolTipProps) {
  return (
    <Container className={direction === "right" ? "right" : "left"}>
      {children}
      <span className={direction === "right" ? "right" : "left"}>{name}</span>
    </Container>
  );
}

export default ToolTip;

