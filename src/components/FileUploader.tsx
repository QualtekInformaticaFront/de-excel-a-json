import React, { useCallback } from 'react';
import { FileUp, FileWarning } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (isValidExcelFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidExcelFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const isValidExcelFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return validTypes.includes(file.type);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-2xl mx-auto"
    >
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <FileUp className="w-12 h-12 mb-4 text-blue-500" />
          <p className="mb-2 text-xl font-semibold text-gray-700">
            Drop your Excel file here
          </p>
          <p className="mb-2 text-sm text-gray-500">
            or click to select a file
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: .xlsx, .xls
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
}