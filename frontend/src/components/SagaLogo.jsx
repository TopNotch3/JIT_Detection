import React from 'react';

export default function SagaLogo({ className = 'w-10 h-10', iconSize = 'w-6 h-6' }) {
  return (
    <div
      className={`${className} rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-600/20 to-purple-600/20 border border-indigo-500/40 flex items-center justify-center shadow-md shadow-indigo-500/10 shrink-0 relative overflow-hidden group`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25)_0%,transparent_70%)] pointer-events-none" />

      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} relative z-10 transition-transform duration-300 group-hover:scale-105`}
      >
        <defs>
          <linearGradient id="saga-core-grad" x1="14" y1="14" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="saga-branch-left" x1="20" y1="6" x2="8" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="saga-branch-right" x1="20" y1="6" x2="32" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="saga-leaf-left" x1="8" y1="22" x2="14" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="saga-leaf-right" x1="32" y1="22" x2="26" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>

          <filter id="saga-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer Graph Attention Field Ring */}
        <circle
          cx="20"
          cy="20"
          r="17.5"
          className="stroke-indigo-400/25"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* AST Syntactic Tree Edges */}
        <line x1="20" y1="7" x2="9" y2="21" stroke="url(#saga-branch-left)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="7" x2="31" y2="21" stroke="url(#saga-branch-right)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="21" x2="14" y2="33" stroke="url(#saga-leaf-left)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="31" y1="21" x2="26" y2="33" stroke="url(#saga-leaf-right)" strokeWidth="1.6" strokeLinecap="round" />

        {/* Cross-Attention & Contrastive Edges (Representing GAT Attention & Counterfactuals) */}
        <line x1="9" y1="21" x2="31" y2="21" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="20" y1="7" x2="20" y2="20" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="14" y1="33" x2="26" y2="33" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* AST Nodes */}
        {/* Root AST Node */}
        <circle cx="20" cy="7" r="3.2" fill="#38bdf8" filter="url(#saga-glow)" />
        <circle cx="20" cy="7" r="1.4" fill="#ffffff" />

        {/* Branch Nodes */}
        <circle cx="9" cy="21" r="2.8" fill="#818cf8" />
        <circle cx="31" cy="21" r="2.8" fill="#c084fc" />

        {/* Leaf Nodes */}
        <circle cx="14" cy="33" r="2.4" fill="#34d399" />
        <circle cx="26" cy="33" r="2.4" fill="#34d399" />

        {/* Central Multi-Head Attention Core */}
        <circle cx="20" cy="20" r="4.2" fill="url(#saga-core-grad)" filter="url(#saga-glow)" />
        <circle cx="20" cy="20" r="1.8" fill="#ffffff" />
      </svg>
    </div>
  );
}
