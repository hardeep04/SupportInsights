/**
 * File Upload Component
 */

import { Upload } from 'lucide-react';
import React, { useRef } from 'react';

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

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    } else if (file) {
      alert('Please select a CSV file');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    } else if (file) {
      alert('Please drop a CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="card card-hover cursor-pointer border-dashed border-2 border-slate-300 hover:border-blue-500 transition-colors"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 p-3 bg-blue-50 rounded-full">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Upload Support Tickets CSV
        </h3>

        <p className="text-slate-600 mb-4">
          Drag and drop your CSV file here or click to browse
        </p>

        {selectedFileName && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <span className="text-green-700 font-medium">{selectedFileName}</span>
          </div>
        )}

        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}

        <p className="text-xs text-slate-500 mt-4">
          Expected columns: ID, Status, Category, CreatedDate, LastUpdatedDate
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
