
import React, { useRef } from 'react';
import { ExcelData } from '../types';

interface FileUploaderProps {
  onUpload: (data: ExcelData) => void;
}

declare const XLSX: any;

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isAllowed = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');

    if (!isAllowed) {
      alert('Por favor selecciona un archivo válido (.xlsx o .csv)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        alert('El archivo está vacío');
        return;
      }

      const headers = jsonData[0] as string[];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      onUpload({ headers, rows });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      <div className="bg-slate-100 p-4 rounded-full group-hover:bg-white transition-colors">
        <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p className="mt-4 text-slate-600 font-medium text-center">Haz clic o arrastra un archivo aquí</p>
      <span className="mt-1 text-slate-400 text-sm">Excel o CSV solamente</span>
    </div>
  );
};

export default FileUploader;
