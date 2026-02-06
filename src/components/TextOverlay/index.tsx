import type { ChangeEvent, KeyboardEvent, RefObject, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TextLayer } from "../../types";
import {
  TextContainer,
  TextBox,
  TextInput,
  TextControls,
  TextActions,
  ApplyButton,
  CancelButton,
} from "./textOverlay.styles";

type TextOverlayProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  editingLayer: TextLayer | null;
  onSave: (layer: TextLayer) => void;
  onDeleteLayer: (id: string) => void;
  onDone: () => void;
};

function TextOverlay({ canvasRef, editingLayer, onSave, onDeleteLayer, onDone }: TextOverlayProps) {
  const { t } = useTranslation();
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const isNew = !editingLayer;
  const [text, setText] = useState(() => editingLayer?.text ?? "");
  const [fontSize, setFontSize] = useState(() => editingLayer?.fontSize ?? 24);
  const [color, setColor] = useState(() => editingLayer?.color ?? "#ffffff");
  const [pos, setPos] = useState(() => {
    if (editingLayer) return { x: editingLayer.x, y: editingLayer.y };
    const canvas = canvasRef.current;
    if (canvas) return { x: canvas.clientWidth / 2 - 60, y: canvas.clientHeight / 2 - 20 };
    return { x: 0, y: 0 };
  });
  const [currentId, setCurrentId] = useState(() => editingLayer?.id ?? crypto.randomUUID());

  useEffect(() => {
    if (editingLayer) {
      setText(editingLayer.text);
      setFontSize(editingLayer.fontSize);
      setColor(editingLayer.color);
      setPos({ x: editingLayer.x, y: editingLayer.y });
      setCurrentId(editingLayer.id);
    }
  }, [editingLayer]);

  const onMouseDown = (e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
  };

  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!dragRef.current) return;
      const { startX, startY, startPosX, startPosY } = dragRef.current;
      setPos({
        x: startPosX + (e.clientX - startX),
        y: startPosY + (e.clientY - startY),
      });
    };
    const onMouseUp = () => { dragRef.current = null; };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDone]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ id: currentId, text, x: pos.x, y: pos.y, fontSize, color });
    onDone();
  };

  const handleDelete = () => {
    if (editingLayer) {
      onDeleteLayer(editingLayer.id);
      onDone();
    }
  };

  return (
    <TextContainer>
      <TextBox style={{ left: pos.x, top: pos.y }} onMouseDown={onMouseDown}>
        <TextInput
          type="text"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder={t("Tools.Text.Placeholder")}
          style={{ fontSize, color }}
          autoFocus
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
        />
        <TextControls>
          <label>{t("Tools.Text.Size")}</label>
          <input
            type="number"
            value={fontSize}
            min={8}
            max={200}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFontSize(Number(e.target.value))}
          />
          <label>{t("Tools.Text.Color")}</label>
          <input
            type="color"
            value={color}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
          />
        </TextControls>
        <TextActions>
          <ApplyButton type="button" onClick={handleSave}>{t("Tools.Text.Apply")}<kbd>↵</kbd></ApplyButton>
          {!isNew && (
            <CancelButton type="button" onClick={handleDelete}>{t("Tools.Text.Delete")}</CancelButton>
          )}
          <CancelButton type="button" onClick={onDone}>{t("Tools.Text.Cancel")}<kbd>Esc</kbd></CancelButton>
        </TextActions>
      </TextBox>
    </TextContainer>
  );
}

export default TextOverlay;
