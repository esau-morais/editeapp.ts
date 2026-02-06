import type { RefObject, KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CropContainer,
  CropMask,
  CropBox,
  CropHandle,
  CropActions,
  ApplyButton,
  CancelButton,
  SrOnly,
} from "./cropOverlay.styles";

type CropRect = { x: number; y: number; w: number; h: number };

type CropOverlayProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  imageToDraw: HTMLImageElement;
  initialRect: CropRect | null;
  setImageToDraw: (img: HTMLImageElement) => void;
  onAppliedRect: (rect: CropRect) => void;
  onDone: () => void;
};

const HANDLES = [
  "top-left", "top-right", "bottom-left", "bottom-right",
  "top", "bottom", "left", "right",
] as const;

const MIN_SIZE = 20;

function CropOverlay({ canvasRef, imageToDraw, initialRect, setImageToDraw, onAppliedRect, onDone }: CropOverlayProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ type: "move" | string; startX: number; startY: number; startRect: CropRect } | null>(null);

  const userInteractedRef = useRef(false);

  const computeFromCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width !== imageToDraw.width || canvas.height !== imageToDraw.height) return null;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw === 0 || ch === 0) return null;
    const margin = 0.1;
    return {
      bounds: { w: cw, h: ch },
      rect: initialRect || {
        x: cw * margin,
        y: ch * margin,
        w: cw * (1 - margin * 2),
        h: ch * (1 - margin * 2),
      },
    };
  }, [canvasRef, imageToDraw, initialRect]);

  const initial = computeFromCanvas();
  const [bounds, setBounds] = useState(initial?.bounds ?? { w: 0, h: 0 });
  const [rect, setRect] = useState<CropRect>(initial?.rect ?? { x: 0, y: 0, w: 0, h: 0 });
  const [ready, setReady] = useState(!!initial);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateBounds = () => {
      const result = computeFromCanvas();
      if (!result) return;
      setBounds(result.bounds);
      if (!userInteractedRef.current) {
        setRect(result.rect);
      }
      setReady(true);
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef, computeFromCanvas]);

  const clamp = useCallback((r: CropRect): CropRect => ({
    x: Math.max(0, Math.min(r.x, bounds.w - MIN_SIZE)),
    y: Math.max(0, Math.min(r.y, bounds.h - MIN_SIZE)),
    w: Math.max(MIN_SIZE, Math.min(r.w, bounds.w - r.x)),
    h: Math.max(MIN_SIZE, Math.min(r.h, bounds.h - r.y)),
  }), [bounds]);

  const onMouseDown = (e: ReactMouseEvent, type: string) => {
    e.stopPropagation();
    e.preventDefault();
    userInteractedRef.current = true;
    dragRef.current = { type, startX: e.clientX, startY: e.clientY, startRect: { ...rect } };
  };

  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!dragRef.current) return;
      const { type, startX, startY, startRect: s } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let next: CropRect;
      if (type === "move") {
        next = { ...s, x: s.x + dx, y: s.y + dy };
        next.x = Math.max(0, Math.min(next.x, bounds.w - next.w));
        next.y = Math.max(0, Math.min(next.y, bounds.h - next.h));
      } else {
        next = { ...s };
        if (type.includes("right"))  next.w = s.w + dx;
        if (type.includes("left"))   { next.x = s.x + dx; next.w = s.w - dx; }
        if (type.includes("bottom")) next.h = s.h + dy;
        if (type.includes("top"))    { next.y = s.y + dy; next.h = s.h - dy; }
        next = clamp(next);
      }
      setRect(next);
    };

    const onMouseUp = () => { dragRef.current = null; };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [bounds, clamp]);

  const cropBoxRef = useRef<HTMLDivElement>(null);
  const [srAnnouncement, setSrAnnouncement] = useState("");

  useEffect(() => {
    if (ready) cropBoxRef.current?.focus();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => {
      setSrAnnouncement(
        `${Math.round(rect.w)} × ${Math.round(rect.h)}, ` +
        `${t("Tools.Crop.Position")} ${Math.round(rect.x)}, ${Math.round(rect.y)}`
      );
    }, 300);
    return () => clearTimeout(id);
  }, [rect, ready, t]);

  const onCropKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") { applyCrop(); return; }
    if (e.key === "Escape") { onDone(); return; }

    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!arrows.includes(e.key)) return;

    e.preventDefault();
    userInteractedRef.current = true;
    const step = e.altKey ? 10 : 1;

    setRect(prev => {
      let next: CropRect;
      if (e.shiftKey) {
        next = { ...prev };
        if (e.key === "ArrowRight") next.w = prev.w + step;
        if (e.key === "ArrowLeft")  next.w = prev.w - step;
        if (e.key === "ArrowDown")  next.h = prev.h + step;
        if (e.key === "ArrowUp")    next.h = prev.h - step;
      } else {
        next = { ...prev };
        if (e.key === "ArrowRight") next.x = prev.x + step;
        if (e.key === "ArrowLeft")  next.x = prev.x - step;
        if (e.key === "ArrowDown")  next.y = prev.y + step;
        if (e.key === "ArrowUp")    next.y = prev.y - step;
      }
      return clamp(next);
    });
  };

  const applyCrop = () => {
    if (!canvasRef.current || !imageToDraw) return;

    const canvas = canvasRef.current;
    const scaleX = imageToDraw.width / canvas.clientWidth;
    const scaleY = imageToDraw.height / canvas.clientHeight;

    const sx = rect.x * scaleX;
    const sy = rect.y * scaleY;
    const sw = rect.w * scaleX;
    const sh = rect.h * scaleY;

    const offscreen = document.createElement("canvas");
    offscreen.width = sw;
    offscreen.height = sh;
    const ctx = offscreen.getContext("2d")!;
    ctx.drawImage(imageToDraw, sx, sy, sw, sh, 0, 0, sw, sh);

    onAppliedRect({ ...rect });
    const newImg = new Image();
    newImg.onload = () => {
      setImageToDraw(newImg);
      onDone();
    };
    newImg.src = offscreen.toDataURL();
  };

  if (!ready) return <CropContainer ref={containerRef} />;

  return (
    <CropContainer ref={containerRef}>
      {/* Dark masks */}
      <CropMask style={{ top: 0, left: 0, width: "100%", height: rect.y }} />
      <CropMask style={{ top: rect.y + rect.h, left: 0, width: "100%", bottom: 0 }} />
      <CropMask style={{ top: rect.y, left: 0, width: rect.x, height: rect.h }} />
      <CropMask style={{ top: rect.y, left: rect.x + rect.w, right: 0, height: rect.h }} />

      <SrOnly role="status" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </SrOnly>

      {/* Crop box */}
      <CropBox
        ref={cropBoxRef}
        tabIndex={0}
        role="application"
        aria-label={t("Left.Items.One")}
        aria-roledescription="crop region"
        style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }}
        onMouseDown={e => onMouseDown(e, "move")}
        onKeyDown={onCropKeyDown}
      >
        {HANDLES.map(h => (
          <CropHandle key={h} className={h} onMouseDown={e => onMouseDown(e, h)} />
        ))}

        <CropActions className={rect.h < 60 ? "outside" : ""}>
          <ApplyButton type="button" onClick={applyCrop}>{t("Tools.Crop.Apply")}<kbd>↵</kbd></ApplyButton>
          <CancelButton type="button" onClick={onDone}>{t("Tools.Crop.Cancel")}<kbd>Esc</kbd></CancelButton>
        </CropActions>
      </CropBox>
    </CropContainer>
  );
}

export default CropOverlay;
