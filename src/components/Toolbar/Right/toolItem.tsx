import type { ReactNode } from "react";
// Components (children)
import ToolTip from "../../Tooltip";
// Components (styles)
import { ItemContent } from "../toolbar.styles";

type ToolItemProps = {
  active: boolean;
  onActive: () => void;
  name: string;
  children: ReactNode;
};

function ToolItem({ active, onActive, name, children }: ToolItemProps) {
  return (
    <ItemContent onClick={onActive}>
      <div className={active ? "activeItem" : ""} />

      <ToolTip direction={"left"} name={name}>
        {children}
      </ToolTip>
    </ItemContent>
  );
}

export default ToolItem;
