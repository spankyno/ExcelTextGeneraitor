
import React, { useState } from 'react';
import { Token, TokenType } from '../types';

interface AssemblyZoneProps {
  tokens: Token[];
  onRemove: (id: string) => void;
  onReorder: (start: number, end: number) => void;
  onAddToken: (type: TokenType, value: string, index?: number) => void;
}

const AssemblyZone: React.FC<AssemblyZoneProps> = ({ tokens, onRemove, onReorder, onAddToken }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragStartInternal = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('tokenIndex', index.toString());
    e.dataTransfer.setData('isInternal', 'true');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    setIsOver(false);
    
    const isInternal = e.dataTransfer.getData('isInternal') === 'true';
    
    if (isInternal) {
      const sourceIndexStr = e.dataTransfer.getData('tokenIndex');
      if (sourceIndexStr && typeof targetIndex === 'number') {
        onReorder(parseInt(sourceIndexStr, 10), targetIndex);
      }
    } else {
      const type = e.dataTransfer.getData('sourceType') as TokenType;
      const value = e.dataTransfer.getData('sourceValue');
      if (type && value) {
        onAddToken(type, value, targetIndex);
      }
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
      className={`
        flex flex-wrap gap-2 min-h-[120px] p-4 rounded-lg border-2 transition-all duration-200
        ${isOver ? 'bg-blue-50 border-blue-400 border-dashed scale-[1.01]' : 'bg-slate-50 border-slate-200'}
        ${tokens.length === 0 ? 'items-center justify-center' : 'content-start'}
      `}
    >
      {tokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-slate-400 pointer-events-none">
          <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-medium">Arrastra campos o herramientas aquí</p>
        </div>
      ) : (
        <>
          {tokens.map((token, index) => (
            <div
              key={token.id}
              draggable
              onDragStart={(e) => handleDragStartInternal(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e, index);
              }}
              className={`
                group flex items-center gap-2 px-3 py-2 rounded-md border transition-all cursor-move select-none shadow-sm max-w-[200px]
                ${token.type === 'field' 
                  ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700' 
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                hover:shadow-md transform active:scale-95
              `}
            >
              <span className="text-sm font-bold tracking-wide truncate">
                {token.type === 'field' ? token.value : (token.value === ' ' ? 'Espacio' : token.value)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(token.id); }}
                className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors flex-shrink-0"
                title="Eliminar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {/* Helper for dropping at the end */}
          <div 
            className="flex-grow min-w-[50px] min-h-[40px]"
            onDrop={(e) => handleDrop(e, tokens.length)}
          />
        </>
      )}
    </div>
  );
};

export default AssemblyZone;
