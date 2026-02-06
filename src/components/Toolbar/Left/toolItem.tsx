import type { ReactNode } from "react";
// Components (children)
import ToolTip from "../../Tooltip";
// Components (styles)
import { ItemContent } from "../toolbar.styles";

type ToolItemProps = {
  active: boolean;
  disabled?: boolean;
  onActive: () => void;
  name: string;
  children: ReactNode;
};

function ToolItem({ active, disabled, onActive, name, children }: ToolItemProps) {
  return (
    <ItemContent
      className={disabled ? "disabled" : ""}
      disabled={disabled}
      onClick={disabled ? undefined : onActive}
    >
      <div className={active ? "activeItem" : ""} />

      <ToolTip direction={"right"} name={name}>
        {children}
      </ToolTip>
    </ItemContent>
  );
}

export default ToolItem;
