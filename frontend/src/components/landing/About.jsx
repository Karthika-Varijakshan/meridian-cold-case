import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6 lg:px-10 bg-[#0A0D12]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-mono tracking-[0.3em] text-[#C9902E] uppercase"
        >
          About Meridian
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl text-gray-300 leading-relaxed mt-6 font-light"
        >
          MERIDIAN is an AI-powered Cold Case Intelligence Platform designed to assist investigators
          in discovering hidden relationships between decades of criminal investigations through
          autonomous multi-agent intelligence.
        </motion.p>
      </div>
    </section>
  );
}
