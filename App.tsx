
import React, { useState, useMemo } from 'react';
import { ExcelData, Token, TokenType, SYMBOLS } from './types';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AssemblyZone from './components/AssemblyZone';
import PreviewSection from './components/PreviewSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [data, setData] = useState<ExcelData | null>(null);
  const [template, setTemplate] = useState<Token[]>([]);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [customText, setCustomText] = useState('');

  const handleFileUpload = (excelData: ExcelData) => {
    setData(excelData);
    setTemplate([]); // Reset template on new file
  };

  const addToken = (type: TokenType, value: string, atIndex?: number) => {
    if (type === 'symbol' && value === '' && customText.trim() === '') return;
    
    const tokenValue = value || customText;
    const newToken: Token = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: tokenValue
    };

    if (typeof atIndex === 'number') {
      const newTemplate = [...template];
      newTemplate.splice(atIndex, 0, newToken);
      setTemplate(newTemplate);
    } else {
      setTemplate(prev => [...prev, newToken]);
    }

    if (!value) setCustomText(''); // Clear custom input if used
  };

  const removeToken = (id: string) => {
    setTemplate(prev => prev.filter(t => t.id !== id));
  };

  const reorderTokens = (startIndex: number, endIndex: number) => {
    const result = Array.from(template);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTemplate(result);
  };

  const generatedText = useMemo(() => {
    if (!data || template.length === 0) return '';
    
    const rowsContent = data.rows.map(row => {
      return template.map(token => {
        if (token.type === 'field') {
          return row[token.value] !== undefined ? String(row[token.value]) : '';
        }
        return token.value;
      }).join('');
    }).join('\n');

    return prefix + rowsContent + suffix;
  }, [data, template, prefix, suffix]);

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated_text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const onDragStartSource = (e: React.DragEvent, type: TokenType, value: string) => {
    e.dataTransfer.setData('sourceType', type);
    e.dataTransfer.setData('sourceValue', value);
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      addToken('symbol', customText);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {!data ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Carga tu archivo</h2>
              <FileUploader onUpload={handleFileUpload} />
              <p className="mt-4 text-sm text-slate-500 text-center">
                Soporta formatos .xlsx, .xls y .csv
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Tools */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">Campos del Archivo</h3>
                  <button 
                    onClick={() => setData(null)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Cambiar archivo
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.headers.map(header => (
                    <div
                      key={header}
                      draggable
                      onDragStart={(e) => onDragStartSource(e, 'field', header)}
                      onClick={() => addToken('field', header)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-sm hover:bg-blue-100 transition-colors cursor-grab active:cursor-grabbing select-none"
                    >
                      {header}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Haz clic o arrastra</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-4">Herramientas de Texto</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {SYMBOLS.map(sym => (
                    <div
                      key={sym.label}
                      draggable
                      onDragStart={(e) => onDragStartSource(e, 'symbol', sym.value)}
                      onClick={() => addToken('symbol', sym.value)}
                      className="px-2 py-2 bg-slate-50 text-slate-600 rounded-md border border-slate-200 text-sm hover:bg-slate-100 transition-colors text-center font-medium cursor-grab active:cursor-grabbing select-none"
                    >
                      {sym.label === ' ' ? '␣' : sym.label}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Texto Personalizado</label>
                  <form onSubmit={handleCustomTextSubmit} className="flex gap-2">
                    <input 
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Escribe algo..."
                      className="flex-grow px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!customText.trim()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <PlusIcon />
                    </button>
                  </form>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-4">Herramientas de Párrafo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Cadena al principio</label>
                    <textarea
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      placeholder="Insertado solo una vez al inicio..."
                      className="w-full p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-16 resize-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Cadena al final</label>
                    <textarea
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="Insertado solo una vez al final..."
                      className="w-full p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-16 resize-none transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assembly & Preview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">Zona de Montaje</h3>
                  {template.length > 0 && (
                    <button 
                      onClick={() => setTemplate([])}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Limpiar zona
                    </button>
                  )}
                </div>
                <AssemblyZone 
                  tokens={template} 
                  onRemove={removeToken}
                  onReorder={reorderTokens}
                  onAddToken={addToken}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">Vista en Tiempo Real</h3>
                  <button
                    onClick={downloadText}
                    disabled={!generatedText}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                  >
                    <DownloadIcon />
                    Descargar .txt
                  </button>
                </div>
                <PreviewSection text={generatedText} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default App;
