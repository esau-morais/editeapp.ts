import type { ReactNode } from "react";
// i18n
import { useTranslation } from "react-i18next";
// Components (children)
import ToolTip from "../../Tooltip";
// Components (styles)
import { ItemContent } from "../toolbar.styles";

type ToolItemProps = {
  upcoming?: boolean;
  active: boolean;
  onActive: () => void;
  name: string;
  children: ReactNode;
};

// Each item will have an icon, a name, and shortcut
// It will be envolved by a tooltip
function ToolItem({ upcoming, active, onActive, name, children }: ToolItemProps) {
  const { t } = useTranslation();

  return (
    <ItemContent className={upcoming ? "upcoming" : ""} onClick={onActive}>
      <div className={active ? "activeItem" : ""} />

      <ToolTip direction={"left"} name={upcoming ? t("Upcoming") : name}>
        {children}
      </ToolTip>
    </ItemContent>
  );
}

export default ToolItem;

