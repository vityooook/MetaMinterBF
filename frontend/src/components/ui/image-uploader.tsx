import { PlusIcon } from "lucide-react";
import React, { useState, useRef } from "react";
import { cn } from "~/lib/utils";
import { FormDescription } from "./form";

interface ImageUploadPreviewProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  resolution?: { width: number; height: number };
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  value,
  onChange,
  accept = ".jpg,.jpeg,.png,.webp,.gif,.svg",
  ...rest
}) => {
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  );
  const [dragging, setDragging] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isFileTypeAllowed = (file: File): boolean => {
    const allowedTypesArray = accept.split(",").map((type) => type.trim());
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    return allowedTypesArray.some((type) => type.includes(fileExtension));
  };

  const handleImageUpload = async (file: File) => {
    if (!isFileTypeAllowed(file)) {
      triggerError("Invalid file type");
      triggerShakeAnimation();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const triggerError = (errorMessage: string) => {
    setError(errorMessage);
    setShowDescription(false);

    setTimeout(() => {
      setError(null);
      setShowDescription(true);
    }, 3000);
  };

  const triggerShakeAnimation = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-card h-32 w-32 p-2 rounded-2xl">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={cn(
            `rounded-[14px] border-dashed border-2 border-gray-300 hover:border-primary hover:text-primary h-full p-4 cursor-pointer flex items-center justify-center`,
            dragging ? "border-primary text-primary" : "",
            preview && "border-none",
            shake && "animate-shake"
          )}
          style={{
            backgroundImage: preview ? `url(${preview})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!preview && <PlusIcon className="w-8 h-8" />}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          {...rest}
        />
      </div>
      {error && (
        <FormDescription className="text-destructive">{error}</FormDescription>
      )}
      {showDescription && (
        <FormDescription className="space-x-2">
          {accept && <span>{accept.replace(/\./g, " ").toUpperCase()}</span>}
        </FormDescription>
      )}
    </div>
  );
};
