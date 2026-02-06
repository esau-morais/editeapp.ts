import type { ReactNode } from "react";
import { useId } from "react";
import { Container } from "./tooltip.styles";

type ToolTipProps = {
  direction: "right" | "left";
  children: ReactNode;
  name: string;
};

function ToolTip({ direction, children, name }: ToolTipProps) {
  const id = useId();
  const className = direction === "right" ? "right" : "left";

  return (
    <Container className={className} aria-describedby={id}>
      {children}
      <span id={id} role="tooltip" className={className}>{name}</span>
    </Container>
  );
}

export default ToolTip;

