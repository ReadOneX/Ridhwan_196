'use client';

import Image from "next/image";

interface Picture {
  id?: number;
  name?: string;
  description?: string;
  displayUrl?: string;
  isBackend?: boolean;
}

interface PictureCardProps {
  pic: Picture;
  idx: number;
  isLoggedIn: boolean;
  onPreview: (pic: Picture) => void;
  onEdit: (pic: Picture) => void;
  onDelete: (pic: Picture) => void;
}

export default function PictureCard({ pic, idx, isLoggedIn, onPreview, onEdit, onDelete }: PictureCardProps) {
  if (!pic.displayUrl) return null;

  return (
    <div 
      onClick={() => onPreview(pic)}
      className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md border-4 border-white hover:border-pink-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-zoom-in bg-white"
    >
      {/* Custom/Backend Badge */}
      {pic.isBackend && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-pink-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
            Kustom
          </span>
        </div>
      )}

      {/* Action Buttons (Visible if logged in) */}
      {isLoggedIn && (
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
          {pic.isBackend && (
            <button 
              onClick={() => onEdit(pic)} 
              className="bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all hover:scale-110 cursor-pointer"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          <button 
            onClick={() => onDelete(pic)} 
            className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all hover:scale-110 cursor-pointer"
            title="Hapus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Image rendering */}
      {pic.isBackend ? (
        <img 
          src={pic.displayUrl} 
          alt={pic.name || ""} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      ) : (
        <Image 
          src={pic.displayUrl} 
          alt={pic.name || ""} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
          sizes="(max-width: 768px) 50vw, 25vw" 
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <span className="bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest block w-fit shadow-sm">
          {pic.name || `Photo #${idx + 1}`}
        </span>
      </div>
    </div>
  );
}