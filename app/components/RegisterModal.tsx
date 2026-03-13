'use client';

import { useState } from 'react';

import { API_URL } from '../lib/api';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess('Account created! Switching to login...');
      setLoading(false);
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      setError('Server connection failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Smooth Backdrop - Close on click */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-backdrop-in"
        onClick={onClose}
      />
      
      {/* Modal Content - Identical to Login with custom animation */}
      <div className="bg-white rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] w-full max-w-[420px] overflow-hidden p-12 relative animate-modal-in z-10 my-auto border border-pink-50">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-300 hover:text-pink-500 transition-all duration-300 cursor-pointer group p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleRegister} className="space-y-10">
          <div className="space-y-8 pt-2">
            {/* Username Field */}
            <div className="space-y-3">
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.25em] ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f8f8f8] border-none rounded-2xl px-6 py-4 text-black text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                required
                placeholder="Pick a username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.25em] ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f8f8f8] border-none rounded-2xl px-6 py-4 text-black text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                required
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ef3054] text-white rounded-2xl py-5 font-black shadow-xl shadow-pink-200/50 hover:bg-[#d92a4c] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <span className="text-gray-400 text-[13px] font-medium">Already have an account?</span>
          <button 
            onClick={onSwitchToLogin} 
            className="text-[#ef3054] font-black text-[13px] hover:underline underline-offset-8 ml-2 cursor-pointer bg-transparent border-none transition-all"
          >
            Login Here
          </button>
        </div>

        {error && (
          <div className="mt-6 text-[#ef3054] text-xs font-black text-center animate-in fade-in slide-in-from-top-2 tracking-tight">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 text-green-500 text-xs font-black text-center animate-in fade-in slide-in-from-top-2 tracking-tight">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}