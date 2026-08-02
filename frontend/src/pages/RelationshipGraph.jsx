import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, Search, Filter, RefreshCw, X, ShieldAlert, FileText } from 'lucide-react';
import CustomNode from '../components/CustomNode';
import { getRelationshipGraph } from '../services/api';

const nodeTypes = {
  custom: CustomNode,
};

export default function RelationshipGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodeFilter, setNodeFilter] = useState('All');

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const data = await getRelationshipGraph();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const filteredNodes = useMemo(() => {
    if (nodeFilter === 'All') return nodes;
    return nodes.filter(n => n.data.nodeType === nodeFilter);
  }, [nodes, nodeFilter]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0D1016]">
      {/* Control Toolbar */}
      <div className="p-4 bg-[#161B22] border-b border-[#232B36] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-[#C9902E]" />
          <h1 className="text-base font-bold font-mono text-white">CROSS-CASE ENTITY NETWORK GRAPH</h1>
          <span className="text-xs font-mono text-gray-400 bg-[#0D1016] px-2 py-0.5 rounded border border-[#232B36]">
            NetworkX Engine
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-gray-400 font-mono">Filter Entity:</span>
            <select
              value={nodeFilter}
              onChange={e => setNodeFilter(e.target.value)}
              className="bg-[#0D1016] text-xs text-gray-200 border border-[#232B36] rounded-lg px-2.5 py-1.5 font-mono focus:border-[#C9902E]"
            >
              <option value="All">All Types ({nodes.length})</option>
              <option value="Case">Cases</option>
              <option value="Person">Persons / Suspects</option>
              <option value="Vehicle">Vehicles</option>
              <option value="Phone">Phone Lines</option>
              <option value="Address">Addresses</option>
              <option value="Organization">Organizations</option>
              <option value="Evidence">Evidence</option>
            </select>
          </div>

          <button
            onClick={fetchGraph}
            className="p-1.5 rounded-lg bg-[#0D1016] border border-[#232B36] text-gray-400 hover:text-white hover:border-[#C9902E] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area & Side Drawer */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          className="bg-[#0D1016]"
        >
          <Background color="#232B36" gap={24} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(n) => (n.data?.nodeType === 'Case' ? '#C9902E' : '#3FA9A0')}
            maskColor="rgba(13, 16, 22, 0.8)"
          />
        </ReactFlow>

        {/* Node Detail Drawer Overlay */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 glass-panel p-5 rounded-2xl border border-[#C9902E] shadow-2xl z-20 space-y-3 font-sans animate-in fade-in slide-in-from-right-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#232B36]">
              <span className="text-[10px] font-mono text-[#C9902E] font-bold uppercase">
                {selectedNode.nodeType} ENTITY DOSSIER
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
              {selectedNode.subtitle && (
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedNode.subtitle}</p>
              )}
            </div>

            {selectedNode.details && (
              <div className="p-3 bg-[#0D1016] border border-[#232B36] rounded-lg text-xs text-gray-300 font-mono leading-relaxed">
                {selectedNode.details}
              </div>
            )}

            {selectedNode.centrality && (
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-gray-400">Network Centrality:</span>
                <span className="font-bold text-[#3FA9A0]">{selectedNode.centrality}</span>
              </div>
            )}

            {selectedNode.score && (
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-gray-400">Case Priority Score:</span>
                <span className="font-bold text-[#C9902E]">{selectedNode.score}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
