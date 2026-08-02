import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderLock,
  FileSearch,
  Cpu,
  Network,
  GitCommitHorizontal,
  Flame,
  FileText,
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Cases', path: '/cases', icon: FolderLock, badge: '20' },
  { name: 'Evidence', path: '/evidence', icon: FileSearch, badge: '100+' },
  { name: 'AI Analysis', path: '/ai-analysis', icon: Cpu, highlight: true },
  { name: 'Relationship Graph', path: '/graph', icon: Network },
  { name: 'Timeline', path: '/timeline', icon: GitCommitHorizontal },
  { name: 'Patterns', path: '/patterns', icon: Flame, badge: 'NEW' },
  { name: 'Intelligence Report', path: '/report', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#161B22] border-r border-[#232B36] flex flex-col h-screen sticky top-0 z-30 select-none no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#232B36] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center shadow-goldGlow">
          <ShieldCheck className="w-6 h-6 text-black font-bold" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-white flex items-center space-x-1.5">
            <span>MERIDIAN</span>
          </h1>
          <p className="text-[11px] text-[#C9902E] tracking-widest uppercase font-mono">
            COLD CASE INTELLIGENCE
          </p>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="px-4 py-2.5 mx-3 my-3 rounded-lg bg-[#0D1016]/60 border border-[#232B36] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA9A0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FA9A0]"></span>
          </span>
          <span className="text-gray-300">LangGraph Active</span>
        </div>
        <span className="text-[#C9902E] font-semibold text-[10px] bg-[#C9902E]/10 px-1.5 py-0.5 rounded border border-[#C9902E]/30">v1.0</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#C9902E]/15 text-[#C9902E] border border-[#C9902E]/40 shadow-goldGlow'
                    : item.highlight
                    ? 'text-[#3FA9A0] hover:bg-[#3FA9A0]/10 hover:text-white border border-[#3FA9A0]/20'
                    : 'text-gray-400 hover:bg-[#1C232D] hover:text-gray-100'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    item.badge === 'NEW'
                      ? 'bg-[#D15B5B]/20 text-[#D15B5B] border border-[#D15B5B]/40'
                      : 'bg-[#232B36] text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User / Command Footer */}
      <div className="p-4 border-t border-[#232B36] bg-[#0D1016]/40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#232B36] border border-[#C9902E]/50 flex items-center justify-center font-mono font-bold text-xs text-[#C9902E]">
            INV
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate">Det. M. Vance</p>
            <p className="text-[10px] text-gray-500 font-mono truncate">Chicago Homicide Division</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
