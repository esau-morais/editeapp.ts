import { createContext, useState } from "react";
import FileUploader from "./components/FileUploader";
import Mobile from "./components/Mobile";
// Components (children)
import ToolbarLeft from "./components/Toolbar/Left";
import ToolbarRight from "./components/Toolbar/Right";
import useMediaQuery from "./hooks/useMediaQuery";
// Custom Hooks
import useThemeSwitcher from "./hooks/useThemeSwitcher";
// Providers
import { ThemeProvider } from "styled-components";
// Components (styles/themes)
import Global from "./styles/global";
import dark from "./styles/themes/dark";
import light from "./styles/themes/light";
import type { ToolbarContextType, ToolsContextType, SliderContextType } from "./types";

// Providers
export const ToolbarContext = createContext<ToolbarContextType | null>(null);
export const ToolsContext = createContext<ToolsContextType | null>(null);
export const SliderContext = createContext<SliderContextType | null>(null);

function App() {
  // Toolbar & slider states
  const [open, setOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<number | undefined>();
  const [show, setShow] = useState(false);
  // Current theme state (light/dark)
  const [theme, setTheme] = useThemeSwitcher("theme", dark);

  const toggleTheme = () => {
    setTheme(theme.title === "dark" ? light : dark);
  };

  // Detect if it is mobile by the size
  const isMobile = useMediaQuery();

  return (
    <ThemeProvider theme={theme}>
      <Global />
      {!isMobile ? (
        <ToolbarContext.Provider value={{ open, setOpen }}>
          <ToolsContext.Provider value={{ activeTool, setActiveTool }}>
            <SliderContext.Provider value={{ show, setShow }}>
              <ToolbarLeft toggleTheme={toggleTheme} />
              <FileUploader />
              <ToolbarRight />
            </SliderContext.Provider>
          </ToolsContext.Provider>
        </ToolbarContext.Provider>
      ) : (
        <Mobile />
      )}
    </ThemeProvider>
  );
}

export default App;

