import React from 'react';
import { ShieldCheck } from 'lucide-react';

const BUILT_WITH = ['React', 'FastAPI', 'LangGraph', 'Python', 'Tailwind'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#161B22] bg-[#0A0D12] py-10 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
          </div>
          <div>
            <p className="font-mono font-bold text-sm text-white tracking-widest">MERIDIAN</p>
            <p className="text-[10px] text-gray-600 tracking-wide">Cold Case Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-gray-600 font-mono">
          <span className="text-gray-700">Built with</span>
          {BUILT_WITH.map((tech, i) => (
            <React.Fragment key={tech}>
              <span>{tech}</span>
              {i < BUILT_WITH.length - 1 && <span className="text-gray-800">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}
