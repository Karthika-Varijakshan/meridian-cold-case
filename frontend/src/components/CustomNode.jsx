import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  FolderLock,
  User,
  Car,
  Phone,
  MapPin,
  Building2,
  Share2,
  FileCode,
  Flame
} from 'lucide-react';

const iconMap = {
  Case: FolderLock,
  Person: User,
  Vehicle: Car,
  Phone: Phone,
  Address: MapPin,
  Organization: Building2,
  'Social Account': Share2,
  Evidence: FileCode
};

const borderColors = {
  Case: 'border-[#C9902E] bg-[#C9902E]/10 text-[#C9902E]',
  Person: 'border-[#D15B5B] bg-[#D15B5B]/10 text-[#D15B5B]',
  Vehicle: 'border-[#3FA9A0] bg-[#3FA9A0]/10 text-[#3FA9A0]',
  Phone: 'border-purple-500 bg-purple-500/10 text-purple-400',
  Address: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  Organization: 'border-blue-500 bg-blue-500/10 text-blue-400',
  'Social Account': 'border-pink-500 bg-pink-500/10 text-pink-400',
  Evidence: 'border-amber-500 bg-amber-500/10 text-amber-400'
};

const CustomNode = ({ data }) => {
  const Icon = iconMap[data.nodeType] || FolderLock;
  const styleClass = borderColors[data.nodeType] || 'border-gray-500 bg-gray-500/10 text-gray-400';

  return (
    <div className={`px-4 py-3 rounded-xl bg-[#161B22] border-2 ${data.nodeType === 'Case' ? 'border-[#C9902E] shadow-goldGlow' : 'border-[#232B36]'} shadow-xl min-w-[200px] max-w-[260px] text-xs font-sans transition-all hover:border-[#C9902E]`}>
      <Handle type="target" position={Position.Top} className="!bg-[#C9902E] !w-3 !h-3" />

      <div className="flex items-center space-x-2.5 mb-1.5">
        <div className={`p-1.5 rounded-lg ${styleClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block">
            {data.nodeType}
          </span>
          <p className="font-semibold text-white truncate text-xs">{data.label}</p>
        </div>
      </div>

      {data.subtitle && (
        <p className="text-[11px] text-gray-400 font-mono truncate">{data.subtitle}</p>
      )}

      {data.score && (
        <div className="mt-2 pt-1.5 border-t border-[#232B36] flex items-center justify-between">
          <span className="text-[10px] text-gray-500 uppercase">Reopen Score</span>
          <span className="font-mono text-xs font-bold text-[#C9902E]">{data.score}%</span>
        </div>
      )}

      {data.centrality && (
        <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <span>Centrality</span>
          <span className="text-[#3FA9A0]">{data.centrality}</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-[#3FA9A0] !w-3 !h-3" />
    </div>
  );
};

export default memo(CustomNode);
