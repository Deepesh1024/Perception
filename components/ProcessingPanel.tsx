import React, { useEffect, useState } from 'react';
import { Zap, Brain, ArrowDown, Radio, Activity } from 'lucide-react';
import { TopDownData, BrainCycleResult, MotorData } from '../types';
import { SensoryPanel } from './SensoryPanel';
import { PredictionPanel } from './PredictionPanel';
import { ConsciousPanel } from './ConsciousPanel';
import { MotorPanel } from './MotorPanel';

interface Props {
  data: BrainCycleResult | null;
  ignitionHistory: { timestamp: number; value: number }[];
  isProcessing: boolean;
  status: string;
  image: string | null;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
}

export const ProcessingPanel: React.FC<Props> = ({ 
  data, 
  ignitionHistory, 
  isProcessing, 
  status, 
  image,
  onPlayAudio,
  isPlayingAudio
}) => {
  const [activeRegion, setActiveRegion] = useState<'none' | 'sensory' | 'prediction' | 'conflict' | 'conscious' | 'motor'>('none');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    // Auto-animate regions during processing if not hovering
    if (hoveredRegion) return;

    if (status === 'SENSORY_INTAKE') setActiveRegion('sensory');
    else if (status === 'TOP_DOWN_PREDICTION') setActiveRegion('prediction');
    else if (status === 'CORTICAL_COMPARISON' || (data?.ignitionScore && data.ignitionScore > 0.4)) setActiveRegion('conflict');
    else if (status === 'CONSCIOUS_PERCEPT') setActiveRegion('conscious');
    else setActiveRegion('none');
  }, [status, data?.ignitionScore, hoveredRegion]);

  const ignitionScore = data?.ignitionScore;

  // Visual state flags based on automated process OR hover
  const showSensory = activeRegion === 'sensory' || hoveredRegion === 'sensory';
  const showPrediction = activeRegion === 'prediction' || hoveredRegion === 'prediction';
  const showMotor = hoveredRegion === 'motor';
  const showConscious = activeRegion === 'conscious' || hoveredRegion === 'conscious';
  const showIgnition = activeRegion === 'conflict' || activeRegion === 'conscious';

  return (
    <div className="w-full h-full relative group flex items-center justify-center">
      
      {/* ----------------- HOVER OVERLAYS ----------------- */}
      
      {/* 1. Sensory Overlay (Left) */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${hoveredRegion === 'sensory' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="w-[320px] h-[500px]">
             <SensoryPanel image={image} data={data?.bottomUp} isProcessing={isProcessing} />
          </div>
      </div>

      {/* 2. Prediction Overlay (Top Right) */}
      <div className={`absolute right-10 top-20 z-30 transition-all duration-300 ${hoveredRegion === 'prediction' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <div className="w-[300px]">
             <PredictionPanel image={image} data={data?.topDown} isProcessing={isProcessing} />
          </div>
      </div>

      {/* 3. Motor Overlay (Top Center) */}
      <div className={`absolute left-1/2 -translate-x-1/2 top-10 z-30 transition-all duration-300 ${hoveredRegion === 'motor' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <MotorPanel data={data?.motor} isProcessing={isProcessing} />
      </div>

      {/* 4. Conscious Overlay (Bottom Right) */}
      <div className={`absolute right-10 bottom-20 z-30 transition-all duration-300 ${hoveredRegion === 'conscious' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="w-[400px]">
            <ConsciousPanel 
                percept={data?.conscious} 
                finalJson={data?.finalPerceptJson} 
                onPlayAudio={onPlayAudio} 
                isPlayingAudio={isPlayingAudio} 
                isProcessing={isProcessing} 
            />
          </div>
      </div>


      {/* ----------------- MAIN BRAIN VISUALIZATION ----------------- */}

      <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
        {/* Background Particles/Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <defs>
                <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                </linearGradient>
            </defs>

            {/* BRAIN CONTAINER GROUP */}
            <g transform="translate(100, 50) scale(0.8)">
                
                {/* 1. OCCIPITAL LOBE (Sensory) - Rear Left */}
                <g 
                   onMouseEnter={() => setHoveredRegion('sensory')}
                   onMouseLeave={() => setHoveredRegion(null)}
                   className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
                >
                    <path d="M 50,300 Q 20,250 50,150 Q 80,100 150,100 L 150,300 Z" 
                          fill={showSensory ? "rgba(6, 182, 212, 0.2)" : "rgba(15, 23, 42, 0.5)"}
                          stroke="#06b6d4" 
                          strokeWidth={showSensory ? 3 : 1}
                          filter={showSensory ? "url(#glow-blue)" : ""}
                    />
                    <text x="60" y="220" fill="#06b6d4" fontSize="14" fontFamily="monospace" opacity={showSensory ? 1 : 0.5} pointerEvents="none">SENSORY (V1)</text>
                </g>

                {/* 2. MOTOR CORTEX - Top Center Strip */}
                <g 
                   onMouseEnter={() => setHoveredRegion('motor')}
                   onMouseLeave={() => setHoveredRegion(null)}
                   className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
                >
                    <path d="M 150,100 Q 250,50 400,50 L 420,150 L 150,150 Z" 
                          fill={showMotor ? "rgba(239, 68, 68, 0.2)" : "rgba(15, 23, 42, 0.5)"}
                          stroke="#ef4444" 
                          strokeWidth={showMotor ? 3 : 1}
                          filter={showMotor ? "url(#glow-red)" : ""}
                    />
                    <text x="220" y="100" fill="#ef4444" fontSize="14" fontFamily="monospace" opacity={showMotor ? 1 : 0.5} pointerEvents="none">MOTOR CORTEX</text>
                </g>

                {/* 3. PREFRONTAL CORTEX (Prediction) - Front Right */}
                <g 
                   onMouseEnter={() => setHoveredRegion('prediction')}
                   onMouseLeave={() => setHoveredRegion(null)}
                   className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
                >
                    <path d="M 400,50 Q 600,50 620,200 Q 600,300 450,300 L 420,150 L 400,50 Z" 
                          fill={showPrediction ? "rgba(249, 115, 22, 0.2)" : "rgba(15, 23, 42, 0.5)"}
                          stroke="#f97316" 
                          strokeWidth={showPrediction ? 3 : 1}
                          filter={showPrediction ? "url(#glow-orange)" : ""}
                    />
                    <text x="480" y="180" fill="#f97316" fontSize="14" fontFamily="monospace" opacity={showPrediction ? 1 : 0.5} pointerEvents="none">PREFRONTAL</text>
                </g>

                {/* 4. TEMPORAL / CONSCIOUS - Bottom Center */}
                <g 
                   onMouseEnter={() => setHoveredRegion('conscious')}
                   onMouseLeave={() => setHoveredRegion(null)}
                   className="cursor-pointer hover:opacity-100 transition-opacity duration-300"
                >
                    <path d="M 150,300 L 150,150 L 420,150 L 450,300 Q 300,450 150,300 Z" 
                          fill={showConscious ? "rgba(34, 197, 94, 0.2)" : "rgba(15, 23, 42, 0.5)"}
                          stroke="#22c55e" 
                          strokeWidth={showConscious ? 3 : 1}
                    />
                    <text x="240" y="250" fill="#22c55e" fontSize="14" fontFamily="monospace" opacity={showConscious ? 1 : 0.5} pointerEvents="none">GLOBAL WORKSPACE</text>
                </g>

                {/* ANIMATED SIGNALS */}
                
                {/* Sensory Input Stream */}
                <path d="M -50,220 L 50,220" stroke="url(#grad-blue)" strokeWidth="4" className={showSensory ? "opacity-100" : "opacity-0"} />
                <circle cx="-50" cy="220" r="4" fill="#06b6d4" className={showSensory ? "animate-ping" : "hidden"} />

                {/* Internal Flow Lines */}
                {/* V1 -> Motor */}
                <path d="M 100,200 Q 150,150 250,100" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" className={showSensory ? "animate-flow" : "opacity-0"} />

                {/* PFC -> Motor */}
                <path d="M 500,150 Q 450,100 350,100" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" className={showPrediction ? "animate-flow" : "opacity-0"} />
                
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes flow {
                        from { stroke-dashoffset: 20; }
                        to { stroke-dashoffset: 0; }
                    }
                    .animate-flow {
                        animation: flow 1s linear infinite;
                    }
                `}} />

            </g>
        </svg>

        {/* Instructions Hint */}
        {!hoveredRegion && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-sm font-mono animate-pulse">
                [ HOVER OVER BRAIN REGIONS TO INSPECT ACTIVITY ]
            </div>
        )}

      </div>
    </div>
  );
};