import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Server, Shield, Database, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [similarityThreshold, setSimilarityThreshold] = useState(75);
  const [minConfidence, setMinConfidence] = useState(80);

  useEffect(() => {
    async function checkBackend() {
      const h = await getHealth();
      setHealth(h);
    }
    checkBackend();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-[#C9902E]" />
          <span>PLATFORM CONFIGURATION & SYSTEM STATUS</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">
          Backend services, model parameters, database connections & security policies
        </p>
      </div>

      {/* Backend Status Card */}
      <div className="glass-panel p-5 rounded-2xl border border-[#232B36] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#232B36]">
          <span className="text-xs font-mono font-bold text-[#C9902E] flex items-center space-x-2">
            <Server className="w-4 h-4" />
            <span>BACKEND FLASK SERVICE STATUS</span>
          </span>
          <span
            className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded flex items-center space-x-1 ${
              health?.status === 'online'
                ? 'bg-[#3FA9A0]/20 text-[#3FA9A0] border border-[#3FA9A0]/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{health?.status === 'online' ? 'ONLINE & READY' : 'OFFLINE / FALLBACK'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-1">
          <div>
            <span className="text-gray-500 block">System Name</span>
            <span className="text-white font-bold">{health?.system || 'MERIDIAN Intelligence'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Backend API Version</span>
            <span className="text-white font-bold">{health?.version || 'v1.0.0'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Database Mode</span>
            <span className="text-[#3FA9A0] font-bold">JSON Store (PostgreSQL Ready)</span>
          </div>
          <div>
            <span className="text-gray-500 block">Graph Engine</span>
            <span className="text-[#C9902E] font-bold">NetworkX 3.0</span>
          </div>
        </div>
      </div>

      {/* AI Model Parameters Tuning */}
      <div className="glass-panel p-6 rounded-2xl border border-[#232B36] space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#232B36] pb-3">
          <Sliders className="w-5 h-5 text-[#3FA9A0]" />
          <h2 className="text-sm font-bold font-mono text-white">LangGraph Agent Threshold Tuning</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">Case Vector Similarity Cutoff</span>
              <span className="text-[#C9902E] font-bold">{similarityThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(e.target.value)}
              className="w-full accent-[#C9902E]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Minimum similarity percentage required for Agent 2 to declare historical match.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">Reopen Confidence Index Threshold</span>
              <span className="text-[#3FA9A0] font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="98"
              value={minConfidence}
              onChange={(e) => setMinConfidence(e.target.value)}
              className="w-full accent-[#3FA9A0]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Score required by Agent 6 to flag a cold case as 'HIGH PRIORITY REOPEN'.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
