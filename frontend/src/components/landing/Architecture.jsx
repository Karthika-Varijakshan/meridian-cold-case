import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Server, GitBranch, Database, Share2 } from 'lucide-react';

const LAYERS = [
  { icon: Monitor, label: 'React Frontend', sub: 'Vite · Tailwind · React Flow' },
  { icon: Server, label: 'API Gateway', sub: 'FastAPI' },
  { icon: GitBranch, label: 'LangGraph Pipeline', sub: '9-agent StateGraph' },
  { icon: Share2, label: 'Knowledge Graph', sub: 'NetworkX correlation engine' },
  { icon: Database, label: 'Case Database', sub: 'Structured evidence store' },
];

export default function Architecture() {
  return (
    <section id="architecture" className="relative py-28 px-6 lg:px-10 bg-[#0A0D12]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#3FA9A0] uppercase">System Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            From request to recommendation
          </h2>
        </motion.div>

        <div className="relative flex flex-col items-center">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <React.Fragment key={layer.label}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="w-full max-w-md glass-panel-gold rounded-xl px-6 py-4 flex items-center space-x-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C9902E]/15 border border-[#C9902E]/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#C9902E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{layer.label}</p>
                    <p className="text-xs text-gray-500 font-mono">{layer.sub}</p>
                  </div>
                </motion.div>

                {i < LAYERS.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                    className="relative h-10 w-px bg-gradient-to-b from-[#C9902E]/50 to-[#3FA9A0]/50 origin-top"
                  >
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3FA9A0]"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                    />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
