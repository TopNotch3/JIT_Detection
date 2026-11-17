import React, { useState, useMemo, useRef } from 'react';
import {
  FileCode,
  GitCommit,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Move,
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
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef(null);

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  // Compute a balanced, multi-column wrapped DAG layout that prevents vertical squishing
  const layout = useMemo(() => {
    if (!nodes.length) return { nodePositions: {}, width: 800, height: 460 };

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

    const layerGroups = [
      { name: 'files', items: layers.files },
      { name: 'hunks', items: layers.hunks },
      layers.structures.length > 0 ? { name: 'structures', items: layers.structures } : null,
      { name: 'elements', items: layers.elements },
    ].filter(Boolean);

    // Limit maximum rows per vertical column to 8 so massive graphs wrap horizontally
    const MAX_ROWS = 8;
    const NODE_WIDTH = 150;
    const NODE_HEIGHT = 38;
    const ROW_GAP = 14;
    const COL_GAP = 40;

    const columnSlices = [];
    layerGroups.forEach((group) => {
      const total = group.items.length;
      if (total <= MAX_ROWS) {
        columnSlices.push(group.items);
      } else {
        // Split large groups into sub-columns
        for (let i = 0; i < total; i += MAX_ROWS) {
          columnSlices.push(group.items.slice(i, i + MAX_ROWS));
        }
      }
    });

    const totalCols = Math.max(1, columnSlices.length);
    const maxRowsInAnyCol = Math.max(1, ...columnSlices.map((c) => c.length));

    const height = Math.max(480, maxRowsInAnyCol * (NODE_HEIGHT + ROW_GAP) + 100);
    const width = Math.max(880, totalCols * (NODE_WIDTH + COL_GAP) + 80);

    const nodePositions = {};
    let currentX = 50 + NODE_WIDTH / 2;

    columnSlices.forEach((slice) => {
      const totalInSlice = slice.length;
      const sliceHeight = totalInSlice * (NODE_HEIGHT + ROW_GAP);
      const startY = (height - sliceHeight) / 2 + NODE_HEIGHT / 2;

      slice.forEach((node, rowIdx) => {
        const y = startY + rowIdx * (NODE_HEIGHT + ROW_GAP);
        nodePositions[node.id] = { x: currentX, y, node };
      });

      currentX += NODE_WIDTH + COL_GAP;
    });

    return { nodePositions, width, height };
  }, [nodes]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prev) => Math.min(3.5, Math.max(0.2, prev * zoomFactor)));
  };

  const handleZoomIn = () => setZoom((z) => Math.min(3.5, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.2, z - 0.25));
  const handleResetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

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

        {/* Stats & Navigation Hint */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <span>{nodes.length} Nodes</span>
          <span>•</span>
          <span>{edges.length} Edges</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-500 font-sans flex items-center gap-1">
            <Move className="w-3 h-3 text-zinc-400" />
            Drag to pan • Scroll to zoom
          </span>
        </div>
      </div>

      {/* SVG Canvas Container with Zoom & Pan */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative shadow-inner select-none transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isExpanded ? 'h-[640px]' : 'h-[480px]'}`}
        style={{ background: 'radial-gradient(circle at 50% 50%, #131317 0%, #09090b 100%)' }}
      >
        {/* Floating Zoom & Pan Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-700/80 p-1.5 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 h-7 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 font-mono text-[11px] flex items-center justify-center transition-colors cursor-pointer"
            title="Reset to 100%"
          >
            {(zoom * 100).toFixed(0)}%
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-zinc-700 mx-0.5" />
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-7 h-7 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Fit to Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Canvas' : 'Expand Canvas'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Drawing Surface */}
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="w-full h-full"
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

          {/* Group with Pan & Zoom Transform */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.05s ease-out' }}
          >
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
                    strokeOpacity={isConnectedToActive ? 0.9 : 0.35}
                    strokeDasharray={e.edge_type === 'control_flow' ? '4 3' : 'none'}
                    markerEnd={`url(#arrow-${e.edge_type})`}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* 2. Render Nodes */}
            {nodes.map((n) => {
              const pos = layout.nodePositions[n.id];
              if (!pos) return null;

              const style = NODE_COLORS[n.node_type] || NODE_COLORS.statement;
              const isSelected = currentNode?.id === n.id;
              const hasAttention = n.evidence_score > 0;

              const nodeW = 150;
              const nodeH = 38;

              return (
                <g
                  key={n.id}
                  transform={`translate(${pos.x - nodeW / 2}, ${pos.y - nodeH / 2})`}
                  onClick={(e) => {
                    e.stopPropagation();
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
                    strokeWidth={isSelected ? 2 : hasAttention ? 1.6 : 1}
                    className="transition-all duration-150"
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))'
                        : hasAttention
                        ? 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))'
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
                    fontSize="9.5"
                    fontWeight={isSelected ? '600' : '500'}
                    fontFamily="var(--font-sans)"
                    className="truncate"
                  >
                    {n.label.length > 17 ? n.label.slice(0, 17) + '…' : n.label}
                  </text>

                  {/* Subtext (Line range) */}
                  <text
                    x="22"
                    y="29"
                    fill="#71717a"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                  >
                    L{n.start_line}–{n.end_line}
                  </text>

                  {/* Attention Weight Pill on Node */}
                  {hasAttention && (
                    <g transform={`translate(${nodeW - 36}, 9)`}>
                      <rect
                        width="30"
                        height="14"
                        rx="4"
                        fill="#18181b"
                        stroke="#3b82f6"
                        strokeWidth="0.8"
                      />
                      <text
                        x="15"
                        y="10.5"
                        textAnchor="middle"
                        fill="#60a5fa"
                        fontSize="7.5"
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
          </g>
        </svg>

        {/* Selected Node Inspector Drawer */}
        {currentNode && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs z-10">
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
