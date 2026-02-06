import styled from "styled-components";

export const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

export const TextBox = styled.div`
  position: absolute;
  cursor: move;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TextInput = styled.input`
  background: transparent;
  border: 1px dashed var(--secondary-blue);
  border-radius: 4px;
  padding: 0.5rem;
  color: inherit;
  font-family: "Montserrat", sans-serif;
  outline: none;
  min-width: 8rem;

  &::placeholder {
    opacity: 0.5;
  }
`;

export const TextControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.secondaryForeground};
  }

  input[type="number"] {
    width: 3.5rem;
    padding: 0.25rem;
    border: 1px solid ${({ theme }) => theme.colors.secondaryForeground};
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.primaryForeground};
    font-size: 0.75rem;
  }

  input[type="color"] {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
  }
`;

export const TextActions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    padding: 0.4rem 1rem;
    border-radius: var(--primary-border-radius);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
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
