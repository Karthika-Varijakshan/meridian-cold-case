import React from 'react';
import { motion } from 'framer-motion';

const TECHS = [
  'React', 'Python', 'FastAPI', 'LangGraph', 'LangChain',
  'NetworkX', 'Machine Learning', 'OCR', 'NLP', 'Framer Motion', 'Tailwind',
];

export default function PoweredBy() {
  const loop = [...TECHS, ...TECHS];

  return (
    <section className="relative py-14 border-y border-[#161B22] bg-[#0A0D12] overflow-hidden">
      <p className="text-center text-[11px] font-mono tracking-[0.3em] text-gray-600 uppercase mb-8">
        Powered By
      </p>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0A0D12] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A0D12] to-transparent z-10" />

        <motion.div
          className="flex space-x-14 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="text-lg font-mono font-medium text-gray-600 hover:text-[#C9902E] transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
