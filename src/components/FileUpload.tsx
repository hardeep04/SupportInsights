/**
 * Modernized AI File Upload Component
 */
import { FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  selectedFileName?: string | undefined;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading,
  selectedFileName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => inputRef.current?.click();

  const handleFileValidation = (file: File | undefined) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      onFileSelect(file);
    } else if (file) {
      // Modern replacement for browser alert
      console.error('Invalid file type');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileValidation(e.target.files?.[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileValidation(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative group cursor-pointer transition-all duration-500 rounded-[2.5rem] p-1 
        ${isDragging ? 'scale-[1.02]' : 'scale-100'}`}
    >
      {/* Dynamic Animated Border Gradient */}
      <div className={`absolute inset-0 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition-opacity duration-500
        ${isDragging ? 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-pulse' : 'bg-slate-300'}`} 
      />

      {/* Main Container */}
      <div className={`relative flex flex-col items-center justify-center py-16 px-6 text-center rounded-[2.4rem] border-2 border-dashed transition-all duration-500
        ${isDragging 
          ? 'bg-blue-50/50 border-blue-500 shadow-2xl shadow-blue-200/50' 
          : 'bg-white/60 backdrop-blur-md border-slate-200 group-hover:border-blue-400 group-hover:bg-white/80'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* The Icon Orb */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500
            ${selectedFileName ? 'bg-emerald-400/30' : 'bg-blue-400/20 group-hover:bg-blue-400/40'}`} 
          />
          <div className={`relative p-5 rounded-3xl transition-all duration-500 transform group-hover:rotate-6
            ${selectedFileName ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-200 shadow-xl'}`}
          >
            {selectedFileName ? <CheckCircle2 size={32} /> : <FileSpreadsheet size={32} />}
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-xs mx-auto space-y-2">
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            {selectedFileName ? "Dataset Ready" : "Upload Tickets Data"}
          </h3>
          
          <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
            {selectedFileName 
              ? "Your tickets are being processed by the AI engine."
              : "Drag your support export (.csv) here or click to browse local files."}
          </p>
        </div>

        {/* Status Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {selectedFileName && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full animate-in slide-in-from-bottom-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{selectedFileName}</span>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full animate-in slide-in-from-bottom-2">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Analyzing Patterns...</span>
            </div>
          )}
        </div>

        {/* Tech Label */}
        <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <div className="w-8 h-[1px] bg-slate-200" />
          <span>CSV Compatible</span>
          <div className="w-8 h-[1px] bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;