// Components (styles)
import { LeftContainer } from "../toolbar.styles";
// Components (children)
import ToolsList from "./tools";

type ToolbarLeftProps = {
  toggleTheme: () => void;
};

function ToolbarLeft({ toggleTheme }: ToolbarLeftProps) {
  return (
    <LeftContainer>
      <ul>
        <ToolsList toggleTheme={toggleTheme} />
      </ul>
    </LeftContainer>
  );
}

export default ToolbarLeft;

