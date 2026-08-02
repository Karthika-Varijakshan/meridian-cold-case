import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommitHorizontal, Calendar, MapPin, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react';
import { getTimeline } from '../services/api';

export default function TimelinePage() {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTimeline() {
      const res = await getTimeline();
      setTimelineEvents(res.timeline || []);
    }
    loadTimeline();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
          <GitCommitHorizontal className="w-6 h-6 text-[#C9902E]" />
          <span>MULTI-DECADAL INVESTIGATIVE TIMELINE</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">
          Chronologically ordered crime events & syndicate milestones (1994 - 2025)
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-[#232B36] ml-4 md:ml-8 space-y-6 py-4">
        {timelineEvents.map((ev, index) => {
          const isExpanded = expandedId === ev.id;
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="relative pl-6 md:pl-10 group"
            >
              {/* Timeline Node Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0D1016] border-2 border-[#C9902E] group-hover:border-white group-hover:scale-125 transition-all flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9902E]" />
              </div>

              {/* Event Card */}
              <div className="glass-panel p-5 rounded-xl border border-[#232B36] hover:border-[#C9902E]/60 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-[#C9902E] bg-[#C9902E]/10 px-2 py-0.5 rounded border border-[#C9902E]/30">
                      {ev.year}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{ev.date}</span>
                    <span className="text-xs font-bold text-white font-mono">{ev.case_id}</span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D15B5B]/20 text-[#D15B5B] border border-[#D15B5B]/30">
                    {ev.priority} Priority
                  </span>
                </div>

                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(ev.id)}>
                  <h3 className="text-base font-bold text-white hover:text-[#C9902E] transition-colors">
                    {ev.title}
                  </h3>
                  <button className="text-gray-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#3FA9A0]" />
                    <span>{ev.location}</span>
                  </span>
                  <span>Crime: {ev.crime_type}</span>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pt-3 mt-2 border-t border-[#232B36] space-y-3"
                    >
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{ev.summary}</p>
                      <button
                        onClick={() => navigate(`/cases/${ev.case_id}`)}
                        className="flex items-center space-x-1.5 text-xs font-mono text-[#C9902E] hover:underline"
                      >
                        <span>OPEN FULL CASE DOSSIER</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
