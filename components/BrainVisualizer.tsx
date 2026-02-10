import React from 'react';
import { BrainRegion, BrainCycleResult, SimulationPhase } from '../types';

interface Props {
  data: BrainCycleResult | null;
  activeRegion: BrainRegion;
  onRegionHover: (region: BrainRegion) => void;
  onRegionClick: (region: BrainRegion) => void;
  status: SimulationPhase;
}

export const BrainVisualizer: React.FC<Props> = ({ 
  data, 
  activeRegion, 
  onRegionHover, 
  onRegionClick,
  status
}) => {
  const colors = {
    V1: '#3b82f6',    // Blue
    IT: '#a855f7',    // Purple
    PFC: '#f97316',   // Orange
    MOTOR: '#22c55e', // Green
  };

  // Helper to determine active visual state for regions
  const getFill = (region: string, baseColor: string) => {
    // If specific region is hovered, highlight it
    if (activeRegion === region) return baseColor;
    
    // During simulation phases, light up strictly involved regions
    if (status === 'SENSORY_INTAKE' && region === 'V1') return baseColor;
    if (status === 'BOTTOM_UP' && (region === 'V1' || region === 'IT')) return baseColor;
    if (status === 'TOP_DOWN_PREDICTION' && region === 'PFC') return baseColor;
    if (status === 'MOTOR_EXECUTION' && region === 'MOTOR') return baseColor;

    // Default Low Opacity
    return `${baseColor}33`; // 20% opacity hex
  };

  const getStrokeWidth = (region: string) => {
    if (activeRegion === region) return 3;
    if (status === 'SENSORY_INTAKE' && region === 'V1') return 3;
    if (status === 'BOTTOM_UP' && region === 'IT') return 3;
    if (status === 'TOP_DOWN_PREDICTION' && region === 'PFC') return 3;
    if (status === 'MOTOR_EXECUTION' && region === 'MOTOR') return 3;
    return 1;
  };

  const showErrorFlash = status === 'CORTICAL_COMPARISON' && data?.metrics.predictionError && data.metrics.predictionError > 0.4;

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#0f172a]">
      {/* Dynamic Background Pulse on High Error */}
      {showErrorFlash && (
         <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>
      )}
      
      <svg viewBox="0 0 800 500" className="w-full h-full max-w-4xl drop-shadow-2xl">
        <defs>
           <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
           <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill={colors.V1} /></marker>
           <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill={colors.PFC} /></marker>
        </defs>

        <g transform="translate(100, 50) scale(0.85)">
            
            {/* --- PHASE 1: SENSORY INPUT ARROWS --- */}
            {status === 'SENSORY_INTAKE' && (
                <g className="animate-fade-in">
                    <path d="M -50,220 L 40,220" stroke={colors.V1} strokeWidth="4" markerEnd="url(#arrow-blue)" className="animate-slide-right" />
                    <path d="M -50,250 L 40,250" stroke={colors.V1} strokeWidth="4" markerEnd="url(#arrow-blue)" className="animate-slide-right" style={{animationDelay: '0.1s'}} />
                    <path d="M -50,280 L 40,280" stroke={colors.V1} strokeWidth="4" markerEnd="url(#arrow-blue)" className="animate-slide-right" style={{animationDelay: '0.2s'}} />
                </g>
            )}

            {/* --- BRAIN REGIONS --- */}

            {/* V1 (Back Left) */}
            <path 
                d="M 50,300 Q 20,250 50,150 Q 80,100 120,100 L 120,300 Z"
                fill={getFill('V1', colors.V1)}
                stroke={colors.V1}
                strokeWidth={getStrokeWidth('V1')}
                className="cursor-pointer transition-colors duration-300"
                onMouseEnter={() => onRegionHover('V1')}
                onMouseLeave={() => onRegionHover('NONE')}
                onClick={() => onRegionClick('V1')}
                filter={activeRegion === 'V1' || status === 'SENSORY_INTAKE' ? "url(#glow)" : ""}
            />
            <text x="60" y="220" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none" opacity="0.8">V1</text>

            {/* IT (Bottom Center) */}
            <path 
                d="M 120,300 L 120,150 L 400,150 L 400,350 Q 250,400 120,300 Z"
                fill={getFill('IT', colors.IT)}
                stroke={colors.IT}
                strokeWidth={getStrokeWidth('IT')}
                className="cursor-pointer transition-colors duration-300"
                onMouseEnter={() => onRegionHover('IT')}
                onMouseLeave={() => onRegionHover('NONE')}
                onClick={() => onRegionClick('IT')}
                filter={activeRegion === 'IT' || status === 'BOTTOM_UP' ? "url(#glow)" : ""}
            />
            <text x="230" y="280" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none" opacity="0.8">IT</text>

            {/* MOTOR (Top Center) */}
            <path 
                d="M 120,100 Q 250,20 400,20 L 420,150 L 120,150 Z"
                fill={getFill('MOTOR', colors.MOTOR)}
                stroke={colors.MOTOR}
                strokeWidth={getStrokeWidth('MOTOR')}
                className="cursor-pointer transition-colors duration-300"
                onMouseEnter={() => onRegionHover('MOTOR')}
                onMouseLeave={() => onRegionHover('NONE')}
                onClick={() => onRegionClick('MOTOR')}
                filter={activeRegion === 'MOTOR' || status === 'MOTOR_EXECUTION' ? "url(#glow)" : ""}
            />
            <text x="240" y="100" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none" opacity="0.8">MOTOR</text>

            {/* PFC (Front Right) */}
            <path 
                d="M 400,20 Q 600,20 620,200 Q 600,350 400,350 L 420,150 L 400,20 Z"
                fill={getFill('PFC', colors.PFC)}
                stroke={colors.PFC}
                strokeWidth={getStrokeWidth('PFC')}
                className="cursor-pointer transition-colors duration-300"
                onMouseEnter={() => onRegionHover('PFC')}
                onMouseLeave={() => onRegionHover('NONE')}
                onClick={() => onRegionClick('PFC')}
                filter={activeRegion === 'PFC' || status === 'TOP_DOWN_PREDICTION' ? "url(#glow)" : ""}
            />
            <text x="500" y="200" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none" opacity="0.8">PFC</text>

            {/* --- INTERNAL FLOW ANIMATIONS --- */}
            
            {/* 1. Bottom-Up: V1 -> IT */}
            {(status === 'BOTTOM_UP') && (
                <path d="M 80,200 Q 150,150 250,250" stroke={colors.V1} strokeWidth="3" fill="none" strokeDasharray="10,10" className="animate-flow" />
            )}

            {/* 2. Top-Down: PFC -> IT */}
            {(status === 'TOP_DOWN_PREDICTION' || status === 'CORTICAL_COMPARISON') && (
                <path d="M 500,180 Q 400,100 250,200" stroke={colors.PFC} strokeWidth="3" fill="none" strokeDasharray="10,10" markerEnd="url(#arrow-orange)" className="animate-flow-reverse" />
            )}

            {/* 3. Motor Execution */}
            {(status === 'MOTOR_EXECUTION') && (
                 <g className="animate-pulse">
                     <path d="M 270,80 L 270,-20" stroke={colors.MOTOR} strokeWidth="5" strokeLinecap="round" />
                     <circle cx="270" cy="-30" r="6" fill={colors.MOTOR} />
                     <text x="290" y="-30" fill={colors.MOTOR} fontSize="14" fontWeight="bold">ACTION OUT</text>
                 </g>
            )}

        </g>
      </svg>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-right { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-right { animation: slide-right 0.5s ease-out forwards; }
        @keyframes flow { to { stroke-dashoffset: -40; } }
        .animate-flow { animation: flow 1s linear infinite; }
        @keyframes flow-rev { to { stroke-dashoffset: 40; } }
        .animate-flow-reverse { animation: flow-rev 1s linear infinite; }
      `}} />
    </div>
  );
};