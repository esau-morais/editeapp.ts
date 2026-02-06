import styled from "styled-components";

export const Container = styled.div`
  span {
    // Initial state
    opacity: 0;
    pointer-events: none;

    // Spacement
    margin-left: 2.25rem;
    padding: var(--button-padding);

    // Size
    width: max-content;
    height: 3rem;

    // Colors
    background-color: var(--primary-blue);
    color: #FFFFFF;

    border-radius: var(--primary-border-radius);

    // Position:
    position: absolute;
    z-index: 1;
    &.right {
      transform: translate3d(0, 0, 0);
    }
    &.left {
      margin-left: 0;
      margin-right: 2.25rem;
      transform: translate3d(calc(-100% - 4rem), 0, 0)
    }

    // Animation: fade out with delay so adjacent hovers stay visible
    transition: opacity .15s ease .1s
  }

  span::after {
    content: " ";

    // Position
    position: absolute;

    // Spacement
    margin-top: -5px;

    // Arrow
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--primary-blue) transparent transparent;
  }
  span.right::after {
    top: 50%;
    right: 100%;
  }
  span.left::after {
    top: 50%;
    left: 100%;
    transform: rotateZ(180deg);
  }

  &:hover > span {
    opacity: 1;

    // Instant show, no delay
    transition: opacity .15s ease 0s
  }
`;

