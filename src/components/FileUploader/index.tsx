import type { ChangeEvent, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
// Providers
import { EditorContext, ToolsContext } from "../../App";
import type { TextLayer } from "../../types";
import Delete from "../../assets/Delete.svg?react";
import Download from "../../assets/Download.svg?react";
import Drag from "../../assets/Drag.svg?react";
// Icons
import Logo from "../../assets/Logo.svg?react";
import Upload from "../../assets/Upload.svg?react";
// Custom Hooks
import useProgressiveImg from "../../hooks/useProgressiveImg";
// i18n
import { useTranslation } from "react-i18next";
// Components (children)
import CropOverlay from "../CropOverlay";
import Slider from "../Slider";
import TextOverlay from "../TextOverlay";
// CSS filters
import DEFAULT_OPTIONS from "../Toolbar/Right/options.json";
import { TextBox } from "../TextOverlay/textOverlay.styles";
// Components (styles)
import { Box, CanvasContainer, ImageBox, UploadState } from "./fileUploader.styles";

type FilterOption = {
  property: string;
  value: number;
  range: {
    min: number;
    max: number;
  };
  unit: string;
};

function FileUploader() {
  const { t } = useTranslation();
  const dndRef = useRef<HTMLFormElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageToDraw, setImageToDraw] = useState<HTMLImageElement | null>(null);
  const [canvasDataUrl, setCanvasDataUrl] = useState("");
  const [, { blur }] = useProgressiveImg("", uploadedImageUrl);
  const [uploadedImageName] = useState("image");
  const toolsContext = useContext(ToolsContext);
  if (!toolsContext)
    throw new Error("FileUploader must be used within ToolsContext");
  const { activeTool } = toolsContext;
  const editorContext = useContext(EditorContext);
  if (!editorContext)
    throw new Error("FileUploader must be used within EditorContext");
  const { editorMode, setEditorMode, setHasImage } = editorContext;
  const [options, setOptions] = useState<FilterOption[]>(DEFAULT_OPTIONS);
  const selectedFilter = options[activeTool ?? 0];
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [lastCropRect, setLastCropRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const pendingCropRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    setHasImage(!!imageToDraw);
  }, [imageToDraw, setHasImage]);

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.items) setIsDragging(true);
  };
  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files) {
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target?.result) return;
        const imageFile = new Image();
        imageFile.onload = () => {
          setImageToDraw(imageFile);
        };
        imageFile.src = e.target.result as string;
        setUploadedImageUrl(imageFile.src);
      };
      fileReader.readAsDataURL(e.dataTransfer.files[0]);

      setIsDragging(false);
      setIsUploading(false);
    }
  };

  const drawCanvas = useCallback(() => {
    if (!imageToDraw || !canvasRef.current) return;

    const displayImage = editorMode === "crop" && originalImage ? originalImage : imageToDraw;
    const canvas = canvasRef.current;
    canvas.width = displayImage.width;
    canvas.height = displayImage.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = handleImageStyling();
    ctx.drawImage(displayImage, 0, 0);

    setCanvasDataUrl(canvas.toDataURL());
  }, [imageToDraw, options, editorMode, originalImage]);

  useEffect(() => {
    drawCanvas();
    const canvas = canvasRef.current;
    const crop = pendingCropRef.current;
    if (canvas && crop) {
      const newW = canvas.clientWidth;
      const newH = canvas.clientHeight;
      if (newW > 0 && newH > 0) {
        const scaleX = newW / crop.w;
        const scaleY = newH / crop.h;
        setTextLayers(prev => prev.map(l => ({
          ...l,
          x: (l.x - crop.x) * scaleX,
          y: (l.y - crop.y) * scaleY,
          fontSize: l.fontSize * scaleX,
        })));
        pendingCropRef.current = null;
      }
    }
  }, [drawCanvas]);

  useEffect(() => {
    const dragzoneEl = dndRef.current;
    if (!dragzoneEl) return;

    dragzoneEl.addEventListener("dragenter", handleDragIn);
    dragzoneEl.addEventListener("dragleave", handleDragOut);
    dragzoneEl.addEventListener("dragover", handleDrag);
    dragzoneEl.addEventListener("drop", handleDrop);

    return () => {
      dragzoneEl.removeEventListener("dragenter", handleDragIn);
      dragzoneEl.removeEventListener("dragleave", handleDragOut);
      dragzoneEl.removeEventListener("dragover", handleDrag);
      dragzoneEl.removeEventListener("drop", handleDrop);
    };
  }, [handleDrop]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;
      const imageFile = new Image();
      imageFile.onload = () => {
        setImageToDraw(imageFile);
      };
      imageFile.src = e.target.result as string;
      setUploadedImageUrl(imageFile.src);
    };
    fileReader.readAsDataURL(e.target.files[0]);

    setIsDragging(false);
    setIsUploading(false);
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if (index !== activeTool) return option;
        return { ...option, value: Number(e.target.value) };
      });
    });
  };

  const handleImageStyling = () => {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return filters.join(" ");
  };

  const layerDragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!layerDragRef.current) return;
      const { id, startX, startY, origX, origY } = layerDragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true;
      setTextLayers(prev => prev.map(l =>
        l.id === id ? { ...l, x: origX + dx, y: origY + dy } : l
      ));
    };
    const onMouseUp = () => { layerDragRef.current = null; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onLayerMouseDown = (e: ReactMouseEvent, layer: TextLayer) => {
    e.preventDefault();
    e.stopPropagation();
    didDragRef.current = false;
    layerDragRef.current = { id: layer.id, startX: e.clientX, startY: e.clientY, origX: layer.x, origY: layer.y };
  };

  const getFlattenedDataUrl = useCallback(() => {
    if (!imageToDraw || !canvasRef.current || textLayers.length === 0) return canvasDataUrl;
    const canvas = canvasRef.current;
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext("2d")!;
    ctx.drawImage(canvas, 0, 0);
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    for (const layer of textLayers) {
      const scaledSize = layer.fontSize * scaleX;
      ctx.font = `${scaledSize}px Montserrat`;
      ctx.fillStyle = layer.color;
      ctx.textBaseline = "top";
      ctx.fillText(layer.text, layer.x * scaleX, layer.y * scaleY);
    }
    return offscreen.toDataURL();
  }, [imageToDraw, canvasDataUrl, textLayers]);

  return (
    <Box className={isDragging ? "box__dragging" : ""} ref={dndRef}>
      {!uploadedImageUrl ? (
        <>
          {!isUploading && !isDragging && (
            <div className="input__box">
              <Logo />
              <input
                type="file"
                name="image[]"
                id="image"
                accept="image/png, image/jpeg"
                onChange={onFileChange}
              />
              <div className="box__upload_text">
                <span>
                  {t("DND.Main")}
                  <span>{t("DND.Or")}</span>
                </span>
                <label htmlFor="image" tabIndex={0}>
                  {t("DND.Label")}
                </label>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {!isDragging && (
            <ImageBox>
              <CanvasContainer>
                <canvas
                  ref={canvasRef}
                  style={{
                    filter: blur ? "blur(1rem)" : "none",
                  }}
                ></canvas>
                {editorMode === "crop" && imageToDraw && (
                  <CropOverlay
                    canvasRef={canvasRef}
                    imageToDraw={originalImage || imageToDraw}
                    initialRect={lastCropRect}
                    setImageToDraw={(img: HTMLImageElement) => {
                      if (!originalImage) setOriginalImage(imageToDraw);
                      setImageToDraw(img);
                    }}
                    onAppliedRect={(cropRect) => {
                      setLastCropRect(cropRect);
                      pendingCropRef.current = cropRect;
                    }}
                    onDone={() => setEditorMode(null)}
                  />
                )}
                {editorMode === "text" && imageToDraw && (
                  <TextOverlay
                    canvasRef={canvasRef}
                    editingLayer={textLayers.find(l => l.id === editingLayerId) || null}
                    onSave={(layer: TextLayer) => {
                      setTextLayers(prev => {
                        const exists = prev.find(l => l.id === layer.id);
                        if (exists) return prev.map(l => l.id === layer.id ? layer : l);
                        return [...prev, layer];
                      });
                      setEditingLayerId(null);
                    }}
                    onDeleteLayer={(id: string) => {
                      setTextLayers(prev => prev.filter(l => l.id !== id));
                      setEditingLayerId(null);
                    }}
                    onDone={() => {
                      setEditingLayerId(null);
                      setEditorMode(null);
                    }}
                  />
                )}
                {editorMode !== "text" && textLayers.map(layer => (
                  <TextBox
                    key={layer.id}
                    style={{ left: layer.x, top: layer.y, zIndex: 10, cursor: "move" }}
                    onMouseDown={e => onLayerMouseDown(e, layer)}
                    onClick={() => {
                      if (didDragRef.current) return;
                      setEditingLayerId(layer.id);
                      setEditorMode("text");
                    }}
                  >
                    <span style={{
                      fontSize: layer.fontSize,
                      color: layer.color,
                      fontFamily: "Montserrat, sans-serif",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}>
                      {layer.text}
                    </span>
                  </TextBox>
                ))}
              </CanvasContainer>
              <button
                onClick={() => {
                  setUploadedImageUrl("");
                  setImageToDraw(null);
                  setCanvasDataUrl("");
                  setTextLayers([]);
                  setOriginalImage(null);
                  setEditingLayerId(null);
                  setLastCropRect(null);
                }}
              >
                <Delete />
              </button>
              <a
                draggable="false"
                href={getFlattenedDataUrl() || uploadedImageUrl}
                download={uploadedImageName}
              >
                <Download />
              </a>
            </ImageBox>
          )}
        </>
      )}
      {isDragging && !isUploading && (
        <UploadState>
          <Drag />
          <span>{t("DND.Main")}</span>
        </UploadState>
      )}
      {isUploading && !isDragging && (
        <UploadState>
          <Upload />
          <strong>{t("DND.Uploading")}</strong>
          <span>{t("DND.UploadingTwo")}</span>
        </UploadState>
      )}
      {uploadedImageUrl && (
        <Slider
          min={selectedFilter?.range.min}
          max={selectedFilter?.range.max}
          value={selectedFilter?.value}
          handleChange={handleSliderChange}
        />
      )}
    </Box>
  );
}

export default FileUploader;
