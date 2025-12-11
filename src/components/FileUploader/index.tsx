import type { ChangeEvent } from "react";
import { useContext, useEffect, useRef, useState } from "react";
// Providers
import { ToolsContext } from "../../App";
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
import Slider from "../Slider";
// CSS filters
import DEFAULT_OPTIONS from "../Toolbar/Right/options.json";
// Components (styles)
import { Box, ImageBox, UploadState } from "./fileUploader.styles";

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
  const [options, setOptions] = useState<FilterOption[]>(DEFAULT_OPTIONS);
  const selectedFilter = options[activeTool ?? 0];

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

  useEffect(() => {
    if (!imageToDraw || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageToDraw.width;
    canvas.height = imageToDraw.height;
    const ctx = canvas.getContext("2d");
    if (ctx && handleImageStyling) ctx.filter = handleImageStyling();
    if (ctx) ctx.drawImage(imageToDraw, 0, 0);
    setCanvasDataUrl(canvas.toDataURL());
  }, [imageToDraw, options]);

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
              <canvas
                ref={canvasRef}
                style={{
                  filter: blur ? "blur(1rem)" : "none",
                }}
              ></canvas>
              <button
                onClick={() => {
                  setUploadedImageUrl("");
                  setImageToDraw(null);
                  setCanvasDataUrl("");
                }}
              >
                <Delete />
              </button>
              <a
                draggable="false"
                href={canvasDataUrl || uploadedImageUrl}
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
