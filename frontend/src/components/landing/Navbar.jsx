import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Technology', href: '#technology' },
  { label: 'Research', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D1016]/85 backdrop-blur-md border-b border-[#232B36]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center shadow-goldGlow group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4.5 h-4.5 text-black" />
          </div>
          <span className="font-mono font-bold tracking-[0.2em] text-white text-sm">MERIDIAN</span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-[#C9902E] transition-colors font-medium tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => navigate('/dashboard')}
          className="group flex items-center space-x-2 bg-[#C9902E] hover:bg-[#E0A33B] text-black font-semibold text-sm px-4 py-2 rounded-lg transition-all shadow-goldGlow"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
}
