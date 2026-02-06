import styled from "styled-components";

export const CropContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

export const CropMask = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
`;

export const CropBox = styled.div`
  position: absolute;
  border: 2px solid var(--secondary-blue);
  box-sizing: border-box;
  cursor: move;
  z-index: 1;

  &:focus {
    outline: none;
  }
  &:focus-visible {
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 2px var(--primary-blue);
  }
`;

export const CropHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--secondary-blue);
  border-radius: 2px;

  &.top-left { top: -5px; left: -5px; cursor: nw-resize }
  &.top-right { top: -5px; right: -5px; cursor: ne-resize }
  &.bottom-left { bottom: -5px; left: -5px; cursor: sw-resize }
  &.bottom-right { bottom: -5px; right: -5px; cursor: se-resize }
  &.top { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize }
  &.bottom { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize }
  &.left { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize }
  &.right { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize }
`;

export const CropActions = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 0.5rem;
  z-index: 1;

  &.outside {
    bottom: auto;
    top: calc(100% + 0.5rem);
  }

  button {
    padding: 0.4rem 1rem;
    border-radius: var(--primary-border-radius);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }
`;

export const ApplyButton = styled.button`
  background-color: var(--primary-blue);
  color: var(--primary-foreground);

  &:hover {
    background-color: #007BCE;
  }
`;

export const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.primaryForeground};

  &:hover {
    opacity: 0.8;
  }
`;

export const SrOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
