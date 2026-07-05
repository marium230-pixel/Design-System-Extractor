import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface VisualDropzoneProps {
  onImageSelected: (base64Image: string, mimeType: string) => void;
  isLoading: boolean;
  theme?: "dark" | "light";
}

export default function VisualDropzone({ onImageSelected, isLoading, theme = "dark" }: VisualDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === "light";

  const processFile = (file: File) => {
    setError(null);

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, or JPEG).");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type);
      } else {
        setError("Could not read image file.");
      }
    };
    reader.onerror = () => {
      setError("Error reading the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full" id="upload-container">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleChange}
        disabled={isLoading}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer text-center group ${
          isDragActive
            ? isLight ? "border-blue-500 bg-blue-50" : "border-blue-500 bg-blue-950/10"
            : isLight
              ? "border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50 shadow-sm"
              : "border-white/5 hover:border-white/10 bg-black/50 hover:bg-black/80"
        } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
        id="dropzone-box"
      >
        <div className={`p-4 rounded-full mb-4 border transition-colors ${
          isLight ? "bg-neutral-100 border-neutral-200 group-hover:border-neutral-300" : "bg-black border-white/5 group-hover:border-white/10"
        }`}>
          <Upload className={`w-8 h-8 ${
            isDragActive 
              ? "text-blue-500" 
              : isLight ? "text-neutral-400 group-hover:text-neutral-700" : "text-white/30 group-hover:text-white/60"
          }`} />
        </div>

        <h3 className={`text-sm font-bold mb-2 ${isLight ? "text-neutral-900" : "text-white"}`}>
          {isDragActive ? "Drop your screenshot here" : "Upload UI Screenshot"}
        </h3>
        
        <p className={`text-xs max-w-sm mb-4 ${isLight ? "text-neutral-500" : "text-white/40"}`}>
          Drag & drop a PNG or JPG file here, or <span className="text-blue-500 font-semibold group-hover:underline">browse files</span>.
        </p>

        <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
          isLight ? "text-neutral-500 bg-neutral-100 border-neutral-200" : "text-white/30 bg-black/60 border-white/5"
        }`}>
          <ImageIcon className="w-3.5 h-3.5" />
          <span>PNG, JPG up to 10MB</span>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-rose-400 text-xs bg-rose-950/20 px-4 py-2 rounded-xl border border-rose-900/40"
            id="upload-error"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
