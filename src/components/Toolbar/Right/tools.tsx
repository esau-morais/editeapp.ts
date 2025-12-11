import type { ReactNode } from "react";
import { useContext } from "react";
// Providers
import { SliderContext, ToolsContext } from "../../../App";
// Icons
import Brightness from "../../../assets/Brightness.svg?react";
import Contrast from "../../../assets/Contrast.svg?react";
import Grayscale from "../../../assets/Grayscale.svg?react";
import Hue from "../../../assets/Hue.svg?react";
import Invert from "../../../assets/Invert.svg?react";
import Saturation from "../../../assets/Saturation.svg?react";
import Sepia from "../../../assets/Sepia.svg?react";
// i18n
import { useTranslation } from "react-i18next";
// Components (children)
import ToolItem from "./toolItem";

type Tool = {
  key: number;
  name: string;
  image: ReactNode;
  onActive: () => void;
  upcoming?: boolean;
};

function ToolsList() {
  const { t } = useTranslation();
  // Manage the tool functions after active
  const sliderContext = useContext(SliderContext);
  if (!sliderContext) throw new Error("ToolsList must be used within SliderContext");
  const { setShow } = sliderContext;
  // Manage the tool statement (active)
  const toolsContext = useContext(ToolsContext);
  if (!toolsContext) throw new Error("ToolsList must be used within ToolsContext");
  const { activeTool, setActiveTool } = toolsContext;

  // Tools properties
  const tools: Tool[] = [
    {
      key: 0,
      name: "Right.Items.One",
      image: <Brightness tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 1,
      name: "Right.Items.Two",
      image: <Contrast tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 2,
      name: "Right.Items.Three",
      image: <Saturation tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 3,
      name: "Right.Items.Four",
      image: <Grayscale tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 4,
      name: "Right.Items.Five",
      image: <Sepia tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 5,
      name: "Right.Items.Six",
      image: <Invert tabIndex={0} />,
      onActive: () => setShow(true),
    },
    {
      key: 6,
      name: "Right.Items.Seven",
      image: <Hue tabIndex={0} />,
      onActive: () => setShow(true),
    },
  ];
  const handleActiveTool = (active: number) => setActiveTool(active);

  return (
    <>
      {/* Tools → 5 */}
      {tools.map((tool, activeIndex) => (
        <ToolItem
          key={tool.key}
          active={activeIndex === activeTool}
          onActive={() => {
            handleActiveTool(activeIndex);
            tool.onActive();
          }}
          name={t(`${tool.name}`)}
          upcoming={tool.upcoming}
        >
          {tool.image}
        </ToolItem>
      ))}
    </>
  );
}

export default ToolsList;

