import { useContext } from "react";
import { ToolbarContext } from "../../../App";
// Components (styles)
import { RightContainer } from "../toolbar.styles";
// Components (child)
import ToolsList from "./tools";

function ToolbarRight() {
  const context = useContext(ToolbarContext);
  if (!context) throw new Error("ToolbarRight must be used within ToolbarContext");
  const { open } = context;

  return (
    <>
      {open && (
        <RightContainer>
          <ul>
            <ToolsList />
          </ul>
        </RightContainer>
      )}
    </>
  );
}

export default ToolbarRight;

