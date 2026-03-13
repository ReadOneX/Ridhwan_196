'use client';

import { useRouter } from 'next/navigation';
import { setAccessToken, API_URL } from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      setAccessToken(data.accessToken);
      onLoginSuccess();
      onClose();
      window.location.reload(); 
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
      
      {/* Modal Content - Centered & Refined with custom animation */}
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

        <form onSubmit={handleLogin} className="space-y-10">
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
                placeholder="Enter username"
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
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ef3054] text-white rounded-2xl py-5 font-black shadow-xl shadow-pink-200/50 hover:bg-[#d92a4c] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <span className="text-gray-400 text-[13px] font-medium">Don't have an account?</span>
          <button 
            onClick={onSwitchToRegister} 
            className="text-[#ef3054] font-black text-[13px] hover:underline underline-offset-8 ml-2 cursor-pointer bg-transparent border-none transition-all"
          >
            Register Now
          </button>
        </div>

        {error && (
          <div className="mt-6 text-[#ef3054] text-xs font-black text-center animate-in fade-in slide-in-from-top-2 tracking-tight">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}