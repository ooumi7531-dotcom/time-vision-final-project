import React from 'react';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

const LoginButton: React.FC = () => {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      alert('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-obsidian via-neutral-900 to-luxury-obsidian">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-playfair font-bold text-white">
            Welcome to Time & Vision
          </h1>
          <p className="text-xl text-neutral-300">
            Sign in to access your exclusive luxury experience
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="group relative inline-flex items-center space-x-3 bg-white hover:bg-luxury-gold text-luxury-obsidian px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-luxury-gold/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
            <span>Continue with Google</span>
            <LogIn className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
