import React from 'react';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userName = user.user_metadata?.full_name || user.email || 'Guest';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-luxury-obsidian/95 backdrop-blur-md shadow-2xl border-b border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <img
              src="/daylogo.png"
              alt="Time & Vision logo"
              className="w-40 h-40 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-2xl font-playfair font-bold text-white">
                Time & Vision
              </h1>
              <p className="text-sm text-luxury-gold font-medium">
                Montres et Lunettes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-luxury-gold/10 backdrop-blur-sm px-6 py-3 rounded-full border border-luxury-gold/30">
              <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-luxury-obsidian" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-luxury-gold font-medium">Welcome,</p>
                <p className="text-white font-bold">{userName}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-luxury-gold/20 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-obsidian px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-luxury-gold/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
