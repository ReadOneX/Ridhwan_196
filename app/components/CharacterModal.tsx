'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch, getAccessToken } from '../lib/api';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  characterToEdit?: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  } | null;
}

export default function CharacterModal({ isOpen, onClose, onSuccess, characterToEdit }: CharacterModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name);
      setDescription(characterToEdit.description || '');
      setPreviewUrl(characterToEdit.imageUrl);
    } else {
      setName('');
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setError('');
  }, [characterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (previewUrl && !previewUrl.startsWith('blob:')) {
      // If no new file, but we have an existing URL (not a blob preview), send it
      formData.append('imageUrl', previewUrl);
    }

    // DEBUG: console.log("Sending to backend:", Object.fromEntries(formData.entries()));

    const method = characterToEdit ? 'PUT' : 'POST';
    const endpoint = characterToEdit ? `/characters/${characterToEdit.id}` : '/characters';

    try {
      // Manual fetch because apiFetch is tuned for JSON
      const token = getAccessToken();
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-pink-600">
          {characterToEdit ? 'Edit Item Gallery' : 'Upload Ke Gallery'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Nama Karakter / Judul</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-200 border rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-gray-200 border rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all h-24 text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Foto</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-pink-400 transition-colors bg-gray-50 overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-40 object-contain" />
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 00-4 4H12a4 4 0 00-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 005.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <span className="relative rounded-md font-medium text-pink-600 hover:text-pink-500">Pilih file dari komputer</span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-3 font-bold hover:bg-gray-200 transition-all">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || (!selectedFile && !characterToEdit)}
              className={`flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl py-3 font-bold shadow-md hover:shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Mengunggah...' : 'Simpan Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}