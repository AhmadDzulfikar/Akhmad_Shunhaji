"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react";

interface CoverImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

type Tab = "upload" | "url";

export default function CoverImageInput({ value, onChange }: CoverImageInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and upload
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload?type=cover", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update with server URL
      onChange(data.url);
      setPreview(data.url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      setPreview("");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  }, [onChange]);

  // Handle URL submission
  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(urlInput.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("URL must start with http:// or https://");
      }
    } catch {
      setError("Invalid URL format");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await fetch("/api/admin/upload-url?type=cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch image");
      }

      onChange(data.url);
      setPreview(data.url);
      setUrlInput("");
    } catch (e: any) {
      setError(e?.message || "Failed to process URL");
    } finally {
      setUploading(false);
    }
  }, [urlInput, onChange]);

  // Clear image
  const handleClear = useCallback(() => {
    onChange("");
    setPreview("");
    setUrlInput("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#b8b8b8]">
        Cover Image
      </label>

      {/* Tabs */}
      <div className="flex border-b border-[#3a3a3a]">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "upload"
              ? "text-[#4a9d6f] border-b-2 border-[#4a9d6f]"
              : "text-[#808080] hover:text-[#f5f1e8]"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          Upload
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "url"
              ? "text-[#4a9d6f] border-b-2 border-[#4a9d6f]"
              : "text-[#808080] hover:text-[#f5f1e8]"
          }`}
          onClick={() => setActiveTab("url")}
        >
          <LinkIcon className="inline-block w-4 h-4 mr-2" />
          URL
        </button>
      </div>

      {/* Preview with Clear button */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Cover preview"
            className="w-full max-h-64 object-cover rounded-lg border border-[#3a3a3a]"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>
      )}

      {/* Upload Tab Content */}
      {activeTab === "upload" && !preview && (
        <div
          className="relative border-2 border-dashed border-[#3a3a3a] rounded-lg p-8 text-center hover:border-[#4a9d6f] transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-[#4a9d6f]" />
              <p className="text-[#808080]">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-10 h-10 text-[#808080]" />
              <p className="text-[#f5f1e8]">
                Drop an image here or click to select
              </p>
              <p className="text-xs text-[#808080]">
                JPG, PNG, WEBP • Max 5MB • Auto-converted to WebP
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Tab Content */}
      {activeTab === "url" && !preview && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 p-3 rounded bg-[#262727] border border-[#3a3a3a] text-[#f5f1e8] placeholder-[#808080] focus:border-[#4a9d6f] focus:outline-none"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={uploading || !urlInput.trim()}
              className="px-4 py-2 rounded bg-[#4a9d6f] text-[#1a1a1a] font-medium disabled:opacity-50 hover:bg-[#3d8a5f] transition flex items-center gap-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Fetch
            </button>
          </div>
          <p className="text-xs text-[#808080]">
            Image will be downloaded, validated, and converted to WebP
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Hidden input for form value */}
      <input type="hidden" name="imageUrl" value={value || ""} />
    </div>
  );
}
