
import React from 'react';

interface PreviewSectionProps {
  text: string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ text }) => {
  return (
    <div className="flex-grow overflow-hidden flex flex-col bg-slate-900 rounded-lg">
      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-slate-400 font-mono ml-2">preview_output.txt</span>
      </div>
      <div className="flex-grow p-4 overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
        {!text ? (
          <div className="h-full flex items-center justify-center text-slate-600 font-mono text-sm italic">
            Esperando montaje...
          </div>
        ) : (
          <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
            {text}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
