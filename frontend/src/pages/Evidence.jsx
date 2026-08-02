import React, { useEffect, useState } from 'react';
import { getCases } from '../services/api';
import { FileSearch, Search, ShieldCheck, Database, FileText } from 'lucide-react';

export default function Evidence() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const res = await getCases();
      const allEv = [];
      (res.cases || []).forEach(c => {
        if (c.evidence) {
          c.evidence.forEach(ev => {
            allEv.push({ ...ev, case_id: c.id, case_title: c.title });
          });
        }
      });
      setEvidenceList(allEv);
    }
    loadData();
  }, []);

  const filtered = evidenceList.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.ocr_text && ev.ocr_text.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || ev.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
          <FileSearch className="w-6 h-6 text-[#3FA9A0]" />
          <span>EVIDENCE CATALOG & FORENSIC OCR DATABASE</span>
        </h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">
          Central physical, biological & digital evidence registry ({filtered.length} Evidence Items)
        </p>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-[#232B36] flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search evidence by title, ballistics lot, DNA profile, or OCR text..."
            className="w-full bg-[#0D1016] text-xs text-gray-200 pl-9 pr-3 py-2 rounded-lg border border-[#232B36] focus:border-[#3FA9A0] font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-mono">Type:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-[#0D1016] text-xs text-gray-200 border border-[#232B36] rounded-lg px-3 py-2 focus:border-[#3FA9A0] font-mono"
          >
            <option value="All">All Types</option>
            <option value="Ballistics">Ballistics</option>
            <option value="DNA">DNA</option>
            <option value="Chemical">Chemical</option>
            <option value="Digital">Digital</option>
            <option value="Financial">Financial</option>
            <option value="Toolmark">Toolmark</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ev => (
          <div key={ev.id} className="glass-panel p-5 rounded-xl border border-[#232B36] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#3FA9A0]">{ev.id}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9902E]/20 text-[#C9902E] border border-[#C9902E]/30">
                {ev.type}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{ev.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Found at: {ev.location}</p>
              <p className="text-[11px] text-[#C9902E] font-mono mt-1">Linked Case: {ev.case_id} ({ev.case_title})</p>
            </div>

            {ev.ocr_text && (
              <div className="p-3 bg-[#0D1016] border border-[#232B36] rounded-lg text-xs font-mono text-emerald-400 space-y-1">
                <span className="text-[9px] uppercase text-gray-500 block">Forensic OCR Text</span>
                <p className="leading-relaxed">{ev.ocr_text}</p>
              </div>
            )}

            <div className="pt-2 border-t border-[#232B36] flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>Status: {ev.status}</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Chain Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
