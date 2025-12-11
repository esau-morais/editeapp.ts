import type { ChangeEvent, CSSProperties, KeyboardEvent } from "react";
import { useContext, useEffect, useState } from "react";
// Providers
import { ToolbarContext } from "../../../App";
// Icons
import Crop from "../../../assets/Crop.svg?react";
import Filter from "../../../assets/Filter.svg?react";
import Settings from "../../../assets/Settings.svg?react";
import Shortcuts from "../../../assets/Shortcuts.svg?react";
import Text from "../../../assets/Text.svg?react";
// i18n
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "styled-components";
import { MainText } from "../../index";
import Modal from "../../Modal";
import Select from "../../Select";
import Switch from "../../Switch";
import Languages from "./languages.json";
// Components (children)
import ToolItem from "./toolItem";

const shortcutsStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

type ToolsListProps = {
  toggleTheme: () => void;
};

function ToolsList({ toggleTheme }: ToolsListProps) {
  const I18NEXT_KEY = "i18nextLng";
  const { t } = useTranslation();
  // Access and set the theme colors
  const theme = useContext(ThemeContext);
  const title = theme?.title;
  // Access and set the tool functions after active
  const context = useContext(ToolbarContext);
  if (!context) throw new Error("ToolsList must be used within ToolbarContext");
  const { setOpen } = context;
  const [openShortcuts, setOpenShortcuts] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  // Manage the tool state (active)
  const [activeTool, setActiveTool] = useState<number | undefined>();

  // i18n
  const [selectedValue, updateSelectedValue] = useState(
    localStorage.getItem(I18NEXT_KEY) || "en",
  );

  const changeLanguage = (option: ChangeEvent<HTMLSelectElement>) => {
    updateSelectedValue(option.target.value);
    localStorage.setItem(I18NEXT_KEY, option.target.value);
    i18next.changeLanguage(option.target.value);
  };

  // Tools properties
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tools = [
    {
      key: 0,
      upcoming: true,
      name: "Left.Items.One",
      image: <Crop tabIndex={0} />,
      onActive: () => {},
    },
    {
      key: 1,
      upcoming: true,
      name: "Left.Items.Two",
      image: <Text tabIndex={0} />,
      onActive: () => {},
    },
    {
      key: 2,
      name: "Left.Items.Three",
      image: <Filter tabIndex={0} />,
      onActive: () => {
        setOpen(true);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code === "KeyF") {
          setOpen(true);
        } else if (e.code === "Escape") {
          setOpen(false);
        }
      },
    },
    {
      key: 3,
      name: "Left.Items.Four",
      image: <Shortcuts tabIndex={0} />,
      onActive: () => {
        setOpenShortcuts(true);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code === "Escape") {
          setOpenShortcuts(false);
          handleShortcutsOnBlur();
        }
      },
    },
    {
      key: 4,
      name: "Left.Items.Five",
      image: <Settings tabIndex={0} />,
      onActive: () => {
        setOpenSettings(true);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code === "KeyS") {
          setOpenSettings(true);
        } else if (e.code === "Escape") {
          setOpenSettings(false);
          handleSettingsOnBlur();
        }
      },
    },
  ];
  // Defines the active tool after the click
  const handleActiveTool = (active: number) => setActiveTool(active);
  // Active tool and toolbar at right lose the focus when the modal is closed
  const handleShortcutsOnBlur = () => {
    setOpenShortcuts(false);
    setActiveTool(undefined);
    setOpen(false);
  };
  const handleSettingsOnBlur = () => {
    setOpenSettings(false);
    setActiveTool(undefined);
    setOpen(false);
  };

  useEffect(() => {
    tools.forEach(tool => {
      if (tool.onKeyDown) {
        document.addEventListener("keydown", tool.onKeyDown as unknown as EventListener);
      }
    });

    return () => {
      tools.forEach(tool => {
        if (tool.onKeyDown) {
          document.removeEventListener("keydown", tool.onKeyDown as unknown as EventListener);
        }
      });
    };
  }, [tools]);

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

      {/* Portal → Shortcuts */}
      <Modal
        toolName={t("Tools.Shortcuts.Name")}
        open={openShortcuts}
        onClose={handleShortcutsOnBlur}
      >
        <section>
          <MainText style={shortcutsStyles}>
            {t("Tools.Shortcuts.Items.Three")}
            <code>f</code>
          </MainText>
          <MainText style={shortcutsStyles}>
            {t("Tools.Shortcuts.Items.Four")}
            <code>s</code>
          </MainText>
        </section>
      </Modal>

      {/* Portal → Settings */}
      <Modal
        toolName={t("Tools.Settings.Name")}
        open={openSettings}
        onClose={handleSettingsOnBlur}
      >
        <section>
          <MainText>{t("Tools.Settings.Items.One")}</MainText>
          {/* Languages switcher */}
          <Select value={selectedValue} onSelectChange={changeLanguage}>
            {Languages.map(language => (
              <option key={language.id} value={language.value}>
                {t(language.name)}
              </option>
            ))}
          </Select>

          <MainText>{t("Tools.Settings.Items.Two")}</MainText>
          {/* Theme switcher */}
          <Switch isToggled={title === "dark"} onSwitch={toggleTheme} />
        </section>
      </Modal>
    </>
  );
}

export default ToolsList;

