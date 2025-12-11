import type { ReactNode } from "react";
import { createPortal } from "react-dom";
// Icons
import Close from "../../assets/Close.svg?react";
import { Heading } from "../index";
// Components (styles)
import { Overlay, Wrapper } from "./modal.styles";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  toolName: string;
  children: ReactNode;
};

function Modal({ open, onClose, toolName, children }: ModalProps) {
  if (!open) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Wrapper>
        <button onClick={onClose}>
          <Close />
        </button>

        <Heading>{toolName}</Heading>

        <section>{children}</section>
      </Wrapper>
    </>,
    document.getElementById("portal")!,
  );
}

export default Modal;

