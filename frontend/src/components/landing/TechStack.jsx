import React from 'react';
import { motion } from 'framer-motion';

const STACK_GROUPS = [
  {
    title: 'Frontend',
    color: '#C9902E',
    items: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Flow'],
  },
  {
    title: 'Backend',
    color: '#3FA9A0',
    items: ['FastAPI', 'Python', 'LangGraph', 'LangChain', 'NetworkX', 'Pandas'],
  },
  {
    title: 'AI & Intelligence',
    color: '#C9902E',
    items: ['OCR', 'NLP / Entity Recognition', 'Knowledge Graph', 'Similarity Search'],
  },
];

export default function TechStack() {
  return (
    <section id="technology" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#C9902E] uppercase">Technology</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Built on a real engineering stack</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STACK_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.color }} />
                <h3 className="text-sm font-mono font-semibold tracking-wide text-white uppercase">{group.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-gray-400 flex items-center space-x-2">
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
