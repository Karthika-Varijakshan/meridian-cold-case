import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles, ShieldAlert, Terminal, Lock } from 'lucide-react';

export default function Header({ onUploadClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cases?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-[#161B22]/95 backdrop-blur border-b border-[#232B36] px-6 flex items-center justify-between sticky top-0 z-20 no-print">
      {/* Global Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, suspects, vehicles, phone numbers, addresses (e.g. 'Econoline', 'Vance')..."
            className="w-full bg-[#0D1016] text-sm text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-[#232B36] focus:border-[#C9902E] focus:outline-none focus:ring-1 focus:ring-[#C9902E] transition-all font-mono placeholder:text-gray-500 placeholder:font-sans"
          />
          <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-[#161B22] border border-[#232B36] rounded">
            Ctrl K
          </kbd>
        </div>
      </form>

      {/* Header Actions */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Run AI Analysis Quick Trigger */}
        <button
          onClick={() => navigate('/ai-analysis')}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#C9902E] to-[#b37a1f] text-black font-semibold text-xs shadow-goldGlow hover:brightness-110 transition-all cursor-pointer font-mono"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>RUN LANGGRAPH AI</span>
        </button>

        {/* Upload Case Button */}
        <button
          onClick={onUploadClick}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#232B36] text-gray-200 text-xs font-medium border border-[#3FA9A0]/30 hover:border-[#3FA9A0] hover:text-white transition-all cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-[#3FA9A0]" />
          <span>Ingest Case</span>
        </button>

        {/* Security Classification Badge */}
        <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded bg-[#D15B5B]/10 border border-[#D15B5B]/30 text-[#D15B5B] text-[11px] font-mono font-semibold uppercase">
          <Lock className="w-3 h-3" />
          <span>LEO RESTRICTED</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg bg-[#0D1016] border border-[#232B36] text-gray-400 hover:text-white hover:border-gray-600 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C9902E]"></span>
        </button>
      </div>
    </header>
  );
}
