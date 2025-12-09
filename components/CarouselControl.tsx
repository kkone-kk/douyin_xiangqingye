
import React, { useState } from 'react';
import { HeroImage, ReferenceImage } from '../types';
import { translations } from '../constants/translations';
import { Wand2, Edit2, Save, RefreshCw, Image as ImageIcon, Check } from 'lucide-react';

interface CarouselControlProps {
  heroImage: HeroImage;
  index: number;
  referenceImages: ReferenceImage[];
  lang: 'zh' | 'en';
  onUpdate: (id: string, updates: Partial<HeroImage>) => void;
  onGenerate: (id: string) => void;
}

const CarouselControl: React.FC<CarouselControlProps> = ({
  heroImage,
  index,
  referenceImages,
  lang,
  onUpdate,
  onGenerate
}) => {
  const t = translations[lang];
  const [isExpanded, setIsExpanded] = useState(false);
  const [editForm, setEditForm] = useState({
    imagePrompt: heroImage.imagePrompt,
    referenceImageId: heroImage.referenceImageId || ''
  });

  const handleSave = () => {
    onUpdate(heroImage.id, { ...editForm, isEditing: false });
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setEditForm({
      imagePrompt: heroImage.imagePrompt,
      referenceImageId: heroImage.referenceImageId || ''
    });
    onUpdate(heroImage.id, { isEditing: false });
    setIsExpanded(false);
  };

  const isGenerating = heroImage.status === 'generating';
  const hasImage = !!heroImage.generatedImageUrl;

  return (
    <div className={`bg-white border rounded-lg transition-all duration-300 ${
      isExpanded ? 'border-orange-200 shadow-md ring-1 ring-orange-100' : 'border-gray-100'
    }`}>
      {/* Collapsed View */}
      <div className="p-3 flex items-center justify-between">
         <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-500 border border-gray-200">
               {hasImage ? (
                  <img src={heroImage.generatedImageUrl} alt="" className="w-full h-full object-cover rounded" />
               ) : (
                  <span>#{index + 1}</span>
               )}
            </div>
            <div className="min-w-0">
               <p className="text-xs font-bold text-gray-800 truncate">{t.heroTypes[heroImage.type]}</p>
               <p className="text-[10px] text-gray-500 truncate">{heroImage.status === 'completed' ? 'Generated' : heroImage.status}</p>
            </div>
         </div>

         <div className="flex items-center gap-1">
            {!isExpanded && (
               <>
                  <button onClick={() => setIsExpanded(true)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50">
                     <Edit2 size={12} />
                  </button>
                  <button 
                     onClick={() => onGenerate(heroImage.id)}
                     disabled={isGenerating}
                     className={`p-1.5 rounded text-white ${isGenerating ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                     {isGenerating ? <RefreshCw size={12} className="animate-spin"/> : <Wand2 size={12} />}
                  </button>
               </>
            )}
         </div>
      </div>

      {/* Expanded Edit View */}
      {isExpanded && (
         <div className="px-3 pb-3 pt-1 border-t border-gray-50 space-y-3">
             <div className="bg-orange-50 p-2 rounded-lg space-y-2">
               <div className="flex items-center gap-1 text-orange-800 text-[10px] font-bold uppercase">
                  <ImageIcon size={10} /> {t.imageGenSettings}
               </div>

               <div>
                 <label className="block text-[10px] font-semibold text-gray-600 mb-1">{t.referenceImage}</label>
                 <select 
                   value={editForm.referenceImageId}
                   onChange={(e) => setEditForm({...editForm, referenceImageId: e.target.value})}
                   className="w-full text-[10px] border border-orange-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-orange-500 outline-none"
                 >
                   {referenceImages.map(img => (
                     <option key={img.id} value={img.id}>
                       {t.labels[img.label]} (ID: ...{img.id.slice(-4)})
                     </option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-[10px] font-semibold text-gray-600 mb-1">{t.aiPrompt} (English)</label>
                 <textarea 
                   rows={3}
                   value={editForm.imagePrompt}
                   onChange={(e) => setEditForm({...editForm, imagePrompt: e.target.value})}
                   className="w-full text-[10px] border border-orange-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-orange-500 outline-none resize-none font-mono text-gray-600"
                 />
               </div>
             </div>

             <div className="flex justify-end gap-2">
                <button onClick={handleCancel} className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">{t.cancel}</button>
                <button onClick={handleSave} className="text-xs px-2 py-1 bg-gray-900 text-white rounded flex items-center gap-1 hover:bg-black">
                   <Check size={10} /> {t.save}
                </button>
             </div>
         </div>
      )}
    </div>
  );
};

export default CarouselControl;
