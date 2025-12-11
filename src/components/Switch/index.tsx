import type { ChangeEvent } from "react";
// Components (styles)
import { CustomSwitch } from "./switch.styles";

type SwitchProps = {
  isToggled: boolean;
  onSwitch: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Switch({ isToggled, onSwitch }: SwitchProps) {
  return (
    <CustomSwitch>
      <input type="checkbox" checked={isToggled} onChange={onSwitch} />
      <span />
    </CustomSwitch>
  );
}

export default Switch;

