import React from 'react';
import { motion } from 'framer-motion';

export default function KpiCard({ title, value, subtext, icon: Icon, color = 'gold', trend }) {
  const colorMap = {
    gold: {
      border: 'border-[#C9902E]/30',
      bg: 'bg-[#C9902E]/10',
      text: 'text-[#C9902E]',
      shadow: 'hover:shadow-goldGlow',
    },
    blue: {
      border: 'border-[#3FA9A0]/30',
      bg: 'bg-[#3FA9A0]/10',
      text: 'text-[#3FA9A0]',
      shadow: 'hover:shadow-blueGlow',
    },
    red: {
      border: 'border-[#D15B5B]/30',
      bg: 'bg-[#D15B5B]/10',
      text: 'text-[#D15B5B]',
      shadow: 'hover:shadow-red-500/20',
    },
  };

  const style = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel p-5 rounded-xl border ${style.border} ${style.shadow} transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold font-mono text-white mt-1.5 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${style.bg} ${style.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-3 pt-2.5 border-t border-[#232B36] flex items-center justify-between text-xs">
          <span className="text-gray-400 text-[11px]">{subtext}</span>
          {trend && (
            <span className={`font-mono font-semibold ${style.text}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
