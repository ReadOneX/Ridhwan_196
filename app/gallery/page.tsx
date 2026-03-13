"use client";

import { useState, useEffect } from "react";
import { apiFetch, getAccessToken } from "../lib/api";
import CharacterModal from "../components/CharacterModal";
import PictureCard from "../components/PictureCard";

interface Picture {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  isBackend?: boolean;
  displayUrl?: string;
  isJikan?: boolean;
  isLocal?: boolean;
}

const LOCAL_PICTURES = [
  { image_url: "/gallery/Haru%20Urara%20%231.png" },
  { image_url: "/gallery/Haru%20Urara%20%232.png" },
  { image_url: "/gallery/Haru%20Urara%20%233.png" },
  { image_url: "/gallery/Haru%20Urara%20%234.png" },
];

export default function GalleryPage() {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [cheerCount, setCheerCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [hiddenUrls, setHiddenUrls] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<Picture | null>(null);

  useEffect(() => {
    const savedHidden = localStorage.getItem('hiddenGalleryUrls');
    if (savedHidden) setHiddenUrls(JSON.parse(savedHidden));
    
    const savedCheers = localStorage.getItem('haruUraraCheers');
    if (savedCheers) setCheerCount(parseInt(savedCheers, 10));

    setIsLoggedIn(!!getAccessToken());
    refreshAll();
  }, []);

  useEffect(() => {
    if (cheerCount > 0) {
      localStorage.setItem('haruUraraCheers', cheerCount.toString());
    }
  }, [cheerCount]);

  const fetchBackendCharacters = async () => {
    try {
      const res = await apiFetch('/characters');
      if (res.ok) {
        const data = await res.json();
        return data.map((char: any) => ({
          ...char,
          isBackend: true,
          displayUrl: char.imageUrl || "/fallback-character.png"
        }));
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
    }
    return [];
  };

  const fetchJikanPictures = async () => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/characters/22615/pictures");
      if (!res.ok) return [];
      const { data } = await res.json();
      return data.map((item: any) => ({
        displayUrl: item.webp?.image_url || item.jpg?.image_url || "/fallback-character.png",
        isJikan: true
      }));
    } catch (err) {
      console.error("Jikan fetch error:", err);
      return [];
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    const [backendChars, jikanPics] = await Promise.all([
      fetchBackendCharacters(),
      fetchJikanPictures()
    ]);

    const localWithFlag = LOCAL_PICTURES.map(p => {
      const fileName = decodeURIComponent(p.image_url.split('/').pop() || "");
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
      return { 
        displayUrl: p.image_url, 
        isLocal: true,
        name: nameWithoutExtension 
      };
    });
    
    setPictures([...localWithFlag, ...jikanPics, ...backendChars]);
    setLoading(false);
  };

  const handleDelete = async (pic: Picture) => {
    const url = pic.displayUrl;
    if (!url || !confirm('Hapus foto ini dari gallery?')) return;

    if (pic.isBackend && pic.id) {
      try {
        const res = await apiFetch(`/characters/${pic.id}`, { method: 'DELETE' });
        if (res.ok) {
          setPictures(pictures.filter(p => p.id !== pic.id));
        } else {
          alert('Gagal menghapus');
        }
      } catch (err) {
        alert('Terjadi kesalahan');
      }
    } else {
      const newHidden = [...hiddenUrls, url];
      setHiddenUrls(newHidden);
      localStorage.setItem('hiddenGalleryUrls', JSON.stringify(newHidden));
    }
  };

  const openAddModal = () => {
    setSelectedCharacter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pic: any) => {
    setSelectedCharacter({ ...pic, imageUrl: pic.displayUrl });
    setIsModalOpen(true);
  };

  const filteredPictures = pictures.filter(p => p.displayUrl && !hiddenUrls.includes(p.displayUrl));

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!previewImage) return;
    const currentIndex = filteredPictures.findIndex(p => p.displayUrl === previewImage.displayUrl);
    const nextIndex = (currentIndex + 1) % filteredPictures.length;
    setPreviewImage(filteredPictures[nextIndex]);
  };

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!previewImage) return;
    const currentIndex = filteredPictures.findIndex(p => p.displayUrl === previewImage.displayUrl);
    const prevIndex = (currentIndex - 1 + filteredPictures.length) % filteredPictures.length;
    setPreviewImage(filteredPictures[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewImage) return;
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage, filteredPictures]);

  if (loading && pictures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6 shadow-xl"></div>
        <p className="text-pink-500 font-black text-xl tracking-widest uppercase">Syncing Haru Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/50 p-8 rounded-[40px] shadow-sm border border-pink-100/50 backdrop-blur-sm">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black text-gray-800 tracking-tight leading-tight">
            Haru<span className="text-pink-500 underline decoration-pink-200 underline-offset-8">Gallery</span>
          </h1>
          <p className="mt-4 text-gray-500 font-medium max-w-md">Discover the most adorable and spirited moments of the pink-haired racing legend.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          {isLoggedIn && (
            <button 
              onClick={openAddModal} 
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3 uppercase tracking-widest text-sm"
            >
              <div className="bg-white/20 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Tambah Gallery
            </button>
          )}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-6 hover:border-pink-300 transition-all group">
            <div className="flex flex-col">
              <span className="text-[10px] text-pink-400 font-black uppercase tracking-[0.2em]">Total Cheers</span>
              <span className="text-3xl font-black text-pink-600 tabular-nums">{cheerCount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setCheerCount(prev => prev + 1)} 
              className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-all shadow-md cursor-pointer group-hover:rotate-12"
            >
              🌸
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {filteredPictures.map((pic, idx) => (
          <PictureCard 
            key={pic.id || pic.displayUrl || idx}
            pic={pic}
            idx={idx}
            isLoggedIn={isLoggedIn}
            onPreview={setPreviewImage}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Lightbox / Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-500"
          onClick={() => setPreviewImage(null)}
        >
          {/* Close Button */}
          <button className="absolute top-8 right-8 text-pink-600 hover:text-pink-800 transition-all p-2 hover:rotate-90 duration-300 z-[110]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={goToPrevious}
            className="absolute left-4 md:left-10 p-4 rounded-full bg-white/20 hover:bg-white/40 text-pink-600 transition-all z-[110] backdrop-blur-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={goToNext}
            className="absolute right-4 md:right-10 p-4 rounded-full bg-white/20 hover:bg-white/40 text-pink-600 transition-all z-[110] backdrop-blur-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="relative max-w-6xl max-h-full flex flex-col items-center gap-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative group shadow-2xl rounded-3xl overflow-hidden border-8 border-white/80">
              <img 
                key={previewImage.displayUrl}
                src={previewImage.displayUrl} 
                alt={previewImage.name || "Preview"} 
                className="max-w-full max-h-[70vh] object-contain animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-500"
              />
            </div>
            {(previewImage.name || previewImage.description) && (
              <div 
                key={`info-${previewImage.displayUrl}`}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl border border-pink-100"
              >
                <h3 className="text-3xl font-black text-pink-600 tracking-tight">{previewImage.name}</h3>
                {previewImage.description && (
                  <p className="text-lg text-gray-600 font-medium max-w-xl leading-relaxed italic mx-auto">
                    {previewImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <CharacterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refreshAll} characterToEdit={selectedCharacter} />
      
      {filteredPictures.length === 0 && (
        <div className="text-center py-32 bg-white/30 rounded-[40px] border-2 border-dashed border-pink-200">
          <div className="text-6xl mb-6 opacity-50">🌸</div>
          <p className="text-gray-400 font-bold text-2xl tracking-widest uppercase">No memories found yet.</p>
        </div>
      )}
    </div>
  );
}