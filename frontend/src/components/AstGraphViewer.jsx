import React, { useState, useMemo } from 'react';
import {
  FileCode,
  GitCommit,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  RefreshCw,
} from 'lucide-react';

const NODE_COLORS = {
  file:      { bg: 'rgba(39, 39, 42, 0.9)',    border: '#52525b', text: '#e4e4e7', icon: FileCode   },
  hunk:      { bg: 'rgba(30, 58, 138, 0.4)',   border: '#3b82f6', text: '#93c5fd', icon: GitCommit  },
  function:  { bg: 'rgba(88, 28, 135, 0.4)',   border: '#a855f7', text: '#d8b4fe', icon: Layers     },
  branch:    { bg: 'rgba(120, 53, 15, 0.4)',   border: '#f59e0b', text: '#fde68a', icon: GitBranch  },
  loop:      { bg: 'rgba(14, 116, 144, 0.4)',  border: '#06b6d4', text: '#a5f3fc', icon: RefreshCw  },
  call:      { bg: 'rgba(6, 78, 59, 0.4)',     border: '#10b981', text: '#a7f3d0', icon: Terminal   },
  statement: { bg: 'rgba(39, 39, 42, 0.6)',    border: '#3f3f46', text: '#d4d4d8', icon: Activity   },
};

const EDGE_COLORS = {
  ast_child:    '#3b82f6', // blue
  control_flow: '#f59e0b', // amber
  call:         '#10b981', // emerald
  diff_align:   '#a855f7', // purple
  data_flow:    '#06b6d4', // cyan
};

export default function AstGraphViewer({ graph, selectedNodeId, onSelectNode }) {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  // Compute a clean, deterministic layered layout
  const layout = useMemo(() => {
    if (!nodes.length) return { nodePositions: {}, width: 800, height: 420 };

    // Group nodes by layer
    const layers = {
      files: [],
      hunks: [],
      structures: [], // function, loop
      elements: [],   // branch, call, statement
    };

    nodes.forEach((n) => {
      if (n.node_type === 'file') layers.files.push(n);
      else if (n.node_type === 'hunk') layers.hunks.push(n);
      else if (['function', 'loop'].includes(n.node_type)) layers.structures.push(n);
      else layers.elements.push(n);
    });

    const activeLayers = [
      layers.files,
      layers.hunks,
      layers.structures.length > 0 ? layers.structures : null,
      layers.elements,
    ].filter(Boolean);

    const width = 860;
    const height = Math.max(460, Math.max(...activeLayers.map((l) => l.length)) * 75 + 80);

    const colWidth = (width - 120) / Math.max(1, activeLayers.length - 1);
    const nodePositions = {};

    activeLayers.forEach((layer, colIdx) => {
      const x = 60 + colIdx * colWidth;
      const totalInLayer = layer.length;
      const rowHeight = (height - 80) / Math.max(1, totalInLayer);

      layer.forEach((node, rowIdx) => {
        const y = 45 + rowIdx * rowHeight + rowHeight / 2;
        nodePositions[node.id] = { x, y, node };
      });
    });

    return { nodePositions, width, height };
  }, [nodes]);

  const currentNode = activeNode || nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  if (!nodes.length) {
    return (
      <div className="rounded-xl bg-zinc-950 p-12 text-center text-zinc-500 border border-zinc-800">
        <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-xs">No AST graph nodes available for this commit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Graph Toolbar & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800 text-xs">
        {/* Node Type Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium">Node Types:</span>
          {Object.entries(NODE_COLORS).map(([type, c]) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border"
              style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.border }} />
              <span className="capitalize">{type}</span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <span>{nodes.length} Nodes</span>
          <span>•</span>
          <span>{edges.length} Edges</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative shadow-inner">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="w-full h-[400px] select-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, #121215 0%, #09090b 100%)' }}
        >
          <defs>
            {/* Arrow markers for edges */}
            {Object.entries(EDGE_COLORS).map(([type, color]) => (
              <marker
                key={type}
                id={`arrow-${type}`}
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
              </marker>
            ))}
          </defs>

          {/* 1. Render Edges */}
          {edges.map((e, idx) => {
            const src = layout.nodePositions[e.source];
            const tgt = layout.nodePositions[e.target];
            if (!src || !tgt) return null;

            const edgeColor = EDGE_COLORS[e.edge_type] || '#52525b';
            const isConnectedToActive =
              currentNode && (currentNode.id === e.source || currentNode.id === e.target);

            // Curved cubic bezier connection
            const dx = tgt.x - src.x;
            const pathData = `M ${src.x} ${src.y} C ${src.x + dx * 0.5} ${src.y}, ${tgt.x - dx * 0.5} ${tgt.y}, ${tgt.x} ${tgt.y}`;

            return (
              <g key={`edge-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={isConnectedToActive ? 2.5 : 1.2}
                  strokeOpacity={isConnectedToActive ? 0.9 : 0.4}
                  strokeDasharray={e.edge_type === 'control_flow' ? '4 3' : 'none'}
                  markerEnd={`url(#arrow-${e.edge_type})`}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* 2. Render Nodes */}
          {nodes.map((n) => {
            const pos = layout.nodePositions[n.id];
            if (!pos) return null;

            const style = NODE_COLORS[n.node_type] || NODE_COLORS.statement;
            const Icon = style.icon;
            const isSelected = currentNode?.id === n.id;
            const hasAttention = n.evidence_score > 0;

            const nodeW = 160;
            const nodeH = 38;

            return (
              <g
                key={n.id}
                transform={`translate(${pos.x - nodeW / 2}, ${pos.y - nodeH / 2})`}
                onClick={() => {
                  setActiveNode(n);
                  if (onSelectNode) onSelectNode(n);
                }}
                className="cursor-pointer group"
              >
                {/* Node Box */}
                <rect
                  width={nodeW}
                  height={nodeH}
                  rx="8"
                  ry="8"
                  fill={style.bg}
                  stroke={isSelected ? '#ffffff' : hasAttention ? '#3b82f6' : style.border}
                  strokeWidth={isSelected ? 2 : hasAttention ? 1.8 : 1}
                  className="transition-all duration-150"
                  style={{
                    filter: isSelected
                      ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                      : hasAttention
                      ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))'
                      : 'none',
                  }}
                />

                {/* Node Type Indicator Dot */}
                <circle cx="12" cy="19" r="3.5" fill={style.border} />

                {/* Node Label */}
                <text
                  x="22"
                  y="18"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight={isSelected ? '600' : '500'}
                  fontFamily="var(--font-sans)"
                  className="truncate"
                >
                  {n.label.length > 18 ? n.label.slice(0, 18) + '…' : n.label}
                </text>

                {/* Subtext (Line range) */}
                <text
                  x="22"
                  y="29"
                  fill="#71717a"
                  fontSize="8.5"
                  fontFamily="var(--font-mono)"
                >
                  L{n.start_line}–{n.end_line}
                </text>

                {/* Attention Weight Pill on Node */}
                {hasAttention && (
                  <g transform={`translate(${nodeW - 38}, 8)`}>
                    <rect
                      width="32"
                      height="15"
                      rx="4"
                      fill="#18181b"
                      stroke="#3b82f6"
                      strokeWidth="0.8"
                    />
                    <text
                      x="16"
                      y="11"
                      textAnchor="middle"
                      fill="#60a5fa"
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {(n.evidence_score * 100).toFixed(0)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Inspector Drawer */}
        {currentNode && (
          <div className="border-t border-zinc-800 bg-zinc-900/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{currentNode.label}</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-medium uppercase border"
                  style={{
                    backgroundColor: NODE_COLORS[currentNode.node_type]?.bg,
                    borderColor: NODE_COLORS[currentNode.node_type]?.border,
                    color: NODE_COLORS[currentNode.node_type]?.text,
                  }}
                >
                  {currentNode.node_type}
                </span>
                <span className="font-mono text-zinc-400 text-[11px]">
                  Lines {currentNode.start_line}–{currentNode.end_line}
                </span>
              </div>
              {currentNode.code_text && (
                <code className="block font-mono text-[11px] text-zinc-300 truncate max-w-xl bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                  {currentNode.code_text}
                </code>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {currentNode.evidence_score > 0 ? (
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400 tabular-nums">
                    {(currentNode.evidence_score * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-zinc-500">GAT Attention Weight</div>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-500 italic">Context AST Node</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
