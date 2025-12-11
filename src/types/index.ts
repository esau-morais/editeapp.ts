import type { ReactNode } from "react";

export type Theme = {
  title: "light" | "dark";
  colors: {
    primaryForeground: string;
    secondaryForeground: string;
    primaryBackground: string;
    secondaryBackground: string;
  };
};

export type ToolbarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type ToolsContextType = {
  activeTool: number | undefined;
  setActiveTool: (activeTool: number | undefined) => void;
};

export type SliderContextType = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export type ToolItemProps = {
  active: boolean;
  onActive: () => void;
  name: string;
  upcoming?: boolean;
  children: ReactNode;
};

export type ToolType = {
  key: number;
  name: string;
  image: ReactNode;
  onActive: () => void;
  upcoming?: boolean;
};
