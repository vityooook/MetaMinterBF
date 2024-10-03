import { PlusIcon } from "lucide-react";
import React, { useState, useRef, ChangeEvent } from "react";

type UploadImageProps = {
  size?: "sm" | "md";
  onImageLoaded?: (image: string | ArrayBuffer | null, file: File) => void;
};

const limit = 5; // MB

const UploadImage: React.FC<UploadImageProps> = ({
  size = "md",
  onImageLoaded,
}) => {
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const imgUploadRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setErrors([]);
      const file = e.target.files[0];
      const fileSize = Math.round((file.size / 1024 / 1024) * 100) / 100;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png"].includes(fileExtension || "");

      if (!isImage) setErrors((prev) => [...prev, "not_image_extension"]);
      if (fileSize > limit) setErrors((prev) => [...prev, "max_size"]);
      if (errors.length > 0) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        setPreviewImage(ev.target?.result || "");
        if (onImageLoaded) {
          onImageLoaded(ev.target?.result as any, file);
        }
      };
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (imgUploadRef.current) {
      imgUploadRef.current.value = "";
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className={`upload-container upload-container--${size}`}>
        <div
          className={`upload-container__plus upload-container__plus--${size}`}
        >
          {previewImage && (
            <div className="upload-cancel-btn" onClick={removeImage}>
              <PlusIcon style={{ transform: "rotate(45deg)" }} />
            </div>
          )}
          <PlusIcon />
          {previewImage && (
            <img
              src={previewImage as string}
              className="file-image"
              alt="Preview"
            />
          )}
          <input
            type="file"
            ref={imgUploadRef}
            className="upload-input"
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
          />
        </div>
      </div>
      {errors.length > 0 && (
        <p className="upload-container__errors">
          {errors[0] === "not_image_extension"
            ? "Invalid image extension"
            : "File exceeds the maximum size"}
        </p>
      )}
      {!previewImage && (
        <p className="upload-container__instructions">
          JPG, PNG
          <br />
          Max. resolution: 3000x3000 px
          <br />
          Max. size: 5MB
        </p>
      )}
    </div>
  );
};

export default UploadImage;
