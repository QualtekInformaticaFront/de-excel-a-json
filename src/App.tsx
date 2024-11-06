import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { JsonPreview } from './components/JsonPreview';
import { processExcelFile } from './utils/excelProcessor';

function App() {
  const [jsonData, setJsonData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setLoading(true);
      setFileName(file.name);
      const processedData = await processExcelFile(file);
      setJsonData(JSON.stringify(processedData, null, 2));
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileSpreadsheet className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel to JSON Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your Excel files to AI-friendly JSON format while preserving structure,
            formatting, and data relationships.
          </p>
        </div>

        <FileUploader onFileSelect={handleFileSelect} />

        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Processing your file...</p>
          </div>
        )}

        {jsonData && !loading && (
          <JsonPreview jsonData={jsonData} fileName={fileName} />
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Supports .xlsx and .xls files • Preserves formatting and formulas • AI-optimized output</p>
        </footer>
      </div>
    </div>
  );
}

export default App;