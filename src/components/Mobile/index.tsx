import type { CSSProperties } from "react";
// Icons
import Logo from "../../assets/Logo.svg?react";
// Components (styles)
import { MainText } from "../index";

const mobileStyles: CSSProperties = {
  width: "100%",
  display: "inherit",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

function Mobile() {
  return (
    <div style={mobileStyles}>
      <Logo style={{ width: "60%" }} />
      <MainText>Edite works better on Desktop :)</MainText>
    </div>
  );
}

export default Mobile;

