import type { ChangeEvent, ReactNode } from "react";
// Components (styles)
import { CustomSelect } from "./select.styles";

type SelectProps = {
  value: string;
  onSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

function Select({ value, onSelectChange, children }: SelectProps) {
  return (
    <CustomSelect value={value} onChange={onSelectChange}>
      {children}
    </CustomSelect>
  );
}

export default Select;

