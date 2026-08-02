import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderLock,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MapPin,
  Calendar,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { getCases } from '../services/api';

export default function Cases({ onOpenUpload }) {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCrimeType, setSelectedCrimeType] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await getCases();
        setCases(res.cases || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  useEffect(() => {
    let result = [...cases];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.crime_type.toLowerCase().includes(q) ||
          (c.summary && c.summary.toLowerCase().includes(q))
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter((c) => c.status === selectedStatus);
    }

    if (selectedPriority !== 'All') {
      result = result.filter((c) => c.priority === selectedPriority);
    }

    if (selectedCrimeType !== 'All') {
      result = result.filter((c) => c.crime_type === selectedCrimeType);
    }

    setFilteredCases(result);
    setCurrentPage(1);
  }, [cases, searchQuery, selectedStatus, selectedPriority, selectedCrimeType]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
            <FolderLock className="w-6 h-6 text-[#C9902E]" />
            <span>COLD CASE REPOSITORY</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Historical investigation archive & active cold case database ({filteredCases.length} Records)
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9902E] to-[#b37a1f] text-black font-mono font-bold text-xs shadow-goldGlow hover:brightness-110 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>INGEST NEW CASE</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-[#232B36] flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, ID, suspect, location..."
            className="w-full bg-[#0D1016] text-xs text-gray-200 pl-9 pr-3 py-2 rounded-lg border border-[#232B36] focus:border-[#C9902E] focus:outline-none font-mono"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-gray-400 font-mono">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0D1016] text-xs text-gray-200 border border-[#232B36] rounded-lg px-2.5 py-1.5 focus:border-[#C9902E] font-mono"
          >
            <option value="All">All Statuses</option>
            <option value="Cold">Cold</option>
            <option value="Reopened">Reopened</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Solved">Solved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-gray-400 font-mono">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0D1016] text-xs text-gray-200 border border-[#232B36] rounded-lg px-2.5 py-1.5 focus:border-[#C9902E] font-mono"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Crime Type Filter */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-gray-400 font-mono">Crime:</span>
          <select
            value={selectedCrimeType}
            onChange={(e) => setSelectedCrimeType(e.target.value)}
            className="bg-[#0D1016] text-xs text-gray-200 border border-[#232B36] rounded-lg px-2.5 py-1.5 focus:border-[#C9902E] font-mono"
          >
            <option value="All">All Crime Types</option>
            <option value="Homicide">Homicide</option>
            <option value="Armed Robbery">Armed Robbery</option>
            <option value="Arson / Homicide">Arson / Homicide</option>
            <option value="Missing Person / Abduction">Missing Person</option>
            <option value="Weapons Trafficking">Weapons Trafficking</option>
            <option value="Grand Larceny / Cargo Hijack">Cargo Hijack</option>
            <option value="Financial Crime / Disappearance">Financial Crime</option>
          </select>
        </div>
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedCases.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/cases/${c.id}`)}
            className="glass-panel p-4 rounded-xl border border-[#232B36] hover:border-[#C9902E]/60 transition-all flex flex-col justify-between cursor-pointer group space-y-3"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#C9902E] bg-[#C9902E]/10 px-2 py-0.5 rounded border border-[#C9902E]/30">
                  {c.id}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    c.priority === 'High'
                      ? 'bg-[#D15B5B]/20 text-[#D15B5B] border border-[#D15B5B]/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {c.priority}
                </span>
              </div>

              {/* Case Title */}
              <h3 className="text-sm font-bold text-white group-hover:text-[#C9902E] transition-colors line-clamp-1">
                {c.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#232B36] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#3FA9A0]" />
                  <span>{c.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span>{c.date}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  Reopen Priority Index
                </span>
                <span className="text-xs font-mono font-bold text-[#C9902E]">
                  {c.reopen_score}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="glass-panel p-4 rounded-xl border border-[#232B36] flex items-center justify-between text-xs font-mono text-gray-400">
        <div>
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#0D1016] border border-[#232B36] hover:border-[#C9902E] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#0D1016] border border-[#232B36] hover:border-[#C9902E] disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
