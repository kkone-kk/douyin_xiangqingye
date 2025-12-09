
import React, { useState, useEffect } from 'react';
import { X, Globe, Save } from 'lucide-react';
import { translations } from '../constants/translations';
import { loadSettings, saveSettings } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'zh' | 'en';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];
  const [proxyUrl, setProxyUrl] = useState('');

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const settings = loadSettings();
      setProxyUrl(settings.proxyUrl || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    saveSettings({ proxyUrl: proxyUrl.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{t.settingsTitle}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Proxy Section */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider">
                <Globe size={16} /> {t.proxySettings}
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.proxyUrlLabel}</label>
                <input 
                   type="text"
                   value={proxyUrl}
                   onChange={(e) => setProxyUrl(e.target.value)}
                   placeholder={t.proxyPlaceholder}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t.proxyHelp}</p>
             </div>
          </div>

        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
           <button 
             onClick={onClose}
             className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
           >
             {t.close}
           </button>
           <button 
             onClick={handleSave}
             className="px-4 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-lg shadow-lg flex items-center gap-2 transition-colors"
           >
             <Save size={14} /> {t.saveSettings}
           </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
