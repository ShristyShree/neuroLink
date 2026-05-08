import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, CalendarCheck } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b-0 border-white/5 py-4 px-6 md:px-12">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <BrainCircuit className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Neuro<span className="text-gradient">Link</span></span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/' ? 'text-white' : 'text-textMuted'}`}
          >
            Experts
          </Link>
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${location.pathname === '/dashboard' ? 'bg-primary/20 text-white border border-primary/30' : 'bg-surfaceLight/50 text-textMuted hover:text-white border border-transparent hover:border-white/10'}`}
          >
            <CalendarCheck className="w-4 h-4" />
            My Bookings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
