
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">Excel Text Generaitor</h4>
            <p className="text-slate-500 text-sm italic">
              Transformación intuitiva de datos a texto.
            </p>
          </div>
          <div className="flex flex-col md:items-end text-sm space-y-1">
            <p className="text-slate-700">
              <strong>Contacto:</strong> <a href="mailto:blog.cottage627@passinbox.com" className="text-blue-600 hover:underline">blog.cottage627@passinbox.com</a>
            </p>
            <p className="text-slate-700">
              <strong>Blog:</strong> <a href="https://aitorblog.infinityfreeapp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://aitorblog.infinityfreeapp.com</a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Aitor Sánchez Gutiérrez &copy; 2026 - Reservados todos los derechos.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
