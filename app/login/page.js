'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 text-black/60 hover:text-black transition-colors flex items-center gap-2 font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">Welcome back.</h1>
          <p className="text-xl text-gray-500 font-medium">Continue your journey to clarity.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 ml-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-lg font-medium focus:outline-none focus:bg-white focus:border-black transition-all placeholder-gray-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold">Password</label>
                <Link href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-lg font-medium focus:outline-none focus:bg-white focus:border-black transition-all placeholder-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black text-white text-lg font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl"
          >
            Sign in
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-500 font-medium">New to Fulcrum? </span>
            <Link href="/signup" className="text-black font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>

      {/* Decorative blurred blob */}
      <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl pointer-events-none opacity-50" />
    </div>
  );
}
