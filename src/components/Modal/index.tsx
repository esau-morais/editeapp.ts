import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    wrapperRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Wrapper ref={wrapperRef} tabIndex={-1} role="dialog" aria-label={toolName}>
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

