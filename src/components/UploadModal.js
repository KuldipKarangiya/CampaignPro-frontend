"use client";

import { useState, useRef } from "react";
import { contactService } from "@/services/api";
import { X, UploadCloud, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { CSV_RECORDS_LIMIT } from "@/constants";

export default function UploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Please select a file first.");
      return;
    }

    setStatus("loading");
    setMessage("Processing upload...");
    
    try {
      // Validate record count
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      const recordCount = lines.length - 1; // Assuming header row

      if (recordCount > CSV_RECORDS_LIMIT) {
        throw new Error(`CSV file too large. Maximum ${CSV_RECORDS_LIMIT.toLocaleString()} records allowed. Found ${recordCount.toLocaleString()}.`);
      }

      const formData = new FormData();
      formData.append("file", file);


      // This single call uploads to Cloudinary AND calls the backend
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setStatus("success");
      setMessage(data.message || "CSV Upload queued successfully.");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFile(null);
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to upload CSV.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-card-border)]">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <UploadCloud className="mr-2 h-5 w-5 text-indigo-400" /> Upload Contacts
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-5">
          <div 
            className="border-2 border-dashed border-[var(--color-card-border)] rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={status === "loading" || status === "success"}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3 text-indigo-400">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="h-10 w-10 text-gray-500 mb-3" />
                <p className="text-sm font-medium text-gray-300">Click to select a CSV file</p>
                <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Only 10-digit phone numbers will be imported.</p>
            <p>Maximum {CSV_RECORDS_LIMIT.toLocaleString()} records per file.</p>
          </div>

          {status === "error" && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center text-emerald-400 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2 shrink-0" />
              {message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#18181b] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {status === "loading" ? "Queueing..." : "Upload CSV"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
