import type { ChangeEvent } from "react";
import { useContext } from "react";
// Providers
import { SliderContext } from "../../App";
// Components (styles)
import { Wrapper } from "./slider.styles";

type SliderProps = {
  min: number;
  max: number;
  value: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Slider({ min, max, value, handleChange }: SliderProps) {
  const context = useContext(SliderContext);
  if (!context) throw new Error("Slider must be used within SliderContext");
  const { show } = context;

  return (
    <>
      {show && (
        <Wrapper>
          <input
            id="slider"
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={handleChange}
          />
          <span className="slider__value">{value}</span>
        </Wrapper>
      )}
    </>
  );
}

export default Slider;

