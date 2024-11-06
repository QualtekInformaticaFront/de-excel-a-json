import React from 'react';
import { Download } from 'lucide-react';

interface JsonPreviewProps {
  jsonData: string;
  fileName: string;
}

export function JsonPreview({ jsonData, fileName }: JsonPreviewProps) {
  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          JSON Preview
        </h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <Download className="w-4 h-4" />
          Download JSON
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-green-400 text-sm">
          {jsonData}
        </pre>
      </div>
    </div>
  );
}