import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ShieldAlert, Car, MapPin, Phone, User, ArrowUpRight } from 'lucide-react';
import { getPatterns } from '../services/api';

export default function Patterns() {
  const [patterns, setPatterns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPatterns() {
      const res = await getPatterns();
      setPatterns(res.patterns || []);
    }
    loadPatterns();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
          <Flame className="w-6 h-6 text-[#D15B5B]" />
          <span>RECURRING CRIMINAL PATTERNS & MO SIGNATURES</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">
          AI pattern discovery algorithm output across 30-year cold case repository
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((pat, index) => (
          <motion.div
            key={pat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-[#232B36] hover:border-[#C9902E]/60 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D15B5B] bg-[#D15B5B]/10 px-2.5 py-1 rounded border border-[#D15B5B]/30">
                  {pat.type}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-gray-400">Risk Score:</span>
                  <span className="text-sm font-mono font-bold text-[#C9902E]">{pat.risk_score}/10</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-3">{pat.title}</h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed font-sans">{pat.description}</p>

              {/* Recurring Entities Chips */}
              <div className="mt-4 pt-3 border-t border-[#232B36]">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-2">Recurring Entities</span>
                <div className="flex flex-wrap gap-1.5">
                  {pat.recurring_entities.map((e, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#0D1016] border border-[#232B36] text-xs font-mono text-[#3FA9A0]"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Affected Cases */}
            <div className="pt-3 border-t border-[#232B36] space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">
                Linked Cases ({pat.affected_cases.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {pat.affected_cases.map((cId) => (
                  <button
                    key={cId}
                    onClick={() => navigate(`/cases/${cId}`)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#161B22] border border-[#232B36] hover:border-[#C9902E] text-xs font-mono text-gray-300 hover:text-white transition-all"
                  >
                    <span>{cId}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
