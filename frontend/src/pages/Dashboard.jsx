import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderLock,
  Flame,
  FileSearch,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { getCases, getPatterns } from '../services/api';

const casesPerYearData = [
  { year: '1994', cases: 1 },
  { year: '1998', cases: 1 },
  { year: '2001', cases: 1 },
  { year: '2003', cases: 1 },
  { year: '2005', cases: 1 },
  { year: '2007', cases: 1 },
  { year: '2009', cases: 1 },
  { year: '2010', cases: 1 },
  { year: '2012', cases: 1 },
  { year: '2014', cases: 1 },
  { year: '2015', cases: 1 },
  { year: '2017', cases: 1 },
  { year: '2018', cases: 1 },
  { year: '2019', cases: 1 },
  { year: '2020', cases: 1 },
  { year: '2021', cases: 1 },
  { year: '2022', cases: 1 },
  { year: '2023', cases: 1 },
  { year: '2024', cases: 1 },
  { year: '2025', cases: 1 },
];

const categoryData = [
  { name: 'Homicide', value: 6, color: '#D15B5B' },
  { name: 'Armed Robbery', value: 5, color: '#C9902E' },
  { name: 'Cargo Theft', value: 4, color: '#3FA9A0' },
  { name: 'Financial Crime', value: 3, color: '#8B5CF6' },
  { name: 'Missing Person', value: 2, color: '#EC4899' },
];

const confidenceData = [
  { range: '90-100%', count: 8 },
  { range: '80-89%', count: 7 },
  { range: '70-79%', count: 3 },
  { range: '<70%', count: 2 },
];

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const cRes = await getCases();
        const pRes = await getPatterns();
        setCases(cRes.cases || []);
        setPatterns(pRes.patterns || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalCases = cases.length;
  const coldCases = cases.filter((c) => c.status === 'Cold').length;
  const highPriority = cases.filter((c) => c.priority === 'High').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Alert */}
      <div className="p-4 rounded-xl glass-panel-gold flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#C9902E]/20 text-[#C9902E]">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-white flex items-center space-x-2">
              <span>TACTICAL HEIST SYNDICATE PATTERN DISCOVERED</span>
              <span className="px-2 py-0.5 text-[10px] bg-[#D15B5B] text-white rounded font-sans">CRITICAL MATCH</span>
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              LangGraph Agent 5 identified 9mm NATO ballistics & thermite MO linking 1994 Chicago Courier homicide to 2024 Union Station robbery.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/ai-analysis')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#C9902E] text-black font-mono font-bold text-xs hover:bg-[#E0A33B] transition-all"
        >
          <span>INSPECT AGENT GRAPH</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Cases"
          value={totalCases || 20}
          subtext="1994 - 2025 Database"
          icon={FolderLock}
          color="gold"
          trend="+3 New"
        />
        <KpiCard
          title="Cold Cases"
          value={coldCases || 14}
          subtext="Awaiting Reopen Action"
          icon={Clock}
          color="red"
          trend="70% Total"
        />
        <KpiCard
          title="Evidence Files"
          value="100+"
          subtext="Ballistics, DNA, Accounts"
          icon={FileSearch}
          color="blue"
          trend="OCR Synced"
        />
        <KpiCard
          title="AI Matches"
          value="4 Patterns"
          subtext="Vector & NetworkX Link"
          icon={Sparkles}
          color="gold"
          trend="96% Max Match"
        />
        <KpiCard
          title="High Priority"
          value={highPriority || 12}
          subtext="Actionable Leads"
          icon={Flame}
          color="red"
          trend="Immediate"
        />
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Per Year Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-[#232B36]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-white">Investigative Timeline Distribution</h3>
              <p className="text-xs text-gray-400">Historical case density per year (1994 - 2025)</p>
            </div>
            <span className="text-xs font-mono text-[#3FA9A0] bg-[#3FA9A0]/10 px-2 py-1 rounded border border-[#3FA9A0]/30">
              31 Years Scope
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesPerYearData}>
                <XAxis dataKey="year" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="cases" fill="#C9902E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Categories Donut Chart */}
        <div className="glass-panel p-5 rounded-xl border border-[#232B36] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono text-white mb-1">Crime Category Breakdown</h3>
            <p className="text-xs text-gray-400 mb-3">Classification across active & cold files</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[#232B36]">
            {categoryData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-400">{item.value} cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Recommended Reopens & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Reopens List */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-[#232B36]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C9902E]" />
              <h3 className="text-sm font-bold font-mono text-white">AI Recommended Cold Cases to Reopen</h3>
            </div>
            <button
              onClick={() => navigate('/cases')}
              className="text-xs text-[#C9902E] hover:underline font-mono"
            >
              View All Cases
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="p-3.5 rounded-lg bg-[#0D1016]/80 border border-[#232B36] hover:border-[#C9902E]/60 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#C9902E]/10 border border-[#C9902E]/30 flex flex-col items-center justify-center font-mono text-xs text-[#C9902E]">
                    <span className="font-bold">{c.reopen_score}%</span>
                    <span className="text-[9px] text-gray-400">SCORE</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#C9902E] transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">
                      {c.id} • {c.location} • {c.crime_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="hidden sm:inline-block text-xs text-gray-400 font-mono">
                    {c.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#D15B5B]/15 text-[#D15B5B] border border-[#D15B5B]/30">
                    {c.priority} Priority
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Alerts & Discovered Patterns Widget */}
        <div className="glass-panel p-5 rounded-xl border border-[#232B36] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#D15B5B]" />
                <span>Active Pattern Alerts</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D15B5B]/20 text-[#D15B5B]">
                4 Discovered
              </span>
            </div>

            <div className="space-y-3">
              {patterns.slice(0, 3).map((pat) => (
                <div key={pat.id} className="p-3 rounded-lg bg-[#0D1016] border border-[#232B36] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{pat.title}</span>
                    <span className="text-[10px] font-mono text-[#C9902E] font-semibold">{pat.pattern_strength}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{pat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/patterns')}
            className="w-full mt-4 py-2 rounded-lg bg-[#232B36] hover:bg-[#2c3746] text-xs font-mono text-gray-200 border border-[#3FA9A0]/30 hover:border-[#3FA9A0] transition-all"
          >
            EXPLORE PATTERN DISCOVERY &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
