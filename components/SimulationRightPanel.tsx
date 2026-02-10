import React from 'react';
import { BrainRegion, BrainCycleResult } from '../types';
import { Activity, Zap, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { ConsciousPanel } from './ConsciousPanel';

interface Props {
  data: BrainCycleResult | null;
  activeRegion: BrainRegion;
  isProcessing: boolean;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
}

export const SimulationRightPanel: React.FC<Props> = ({ 
  data, 
  activeRegion, 
  isProcessing,
  onPlayAudio,
  isPlayingAudio
}) => {
  
  // -- REGION SPECIFIC VIEW --
  if (activeRegion !== 'NONE' && data) {
     return (
        <div className="h-full flex flex-col bg-slate-900/50 border-l border-slate-800 p-6 animate-in slide-in-from-right-10">
            <div className="mb-6 pb-4 border-b border-slate-700">
               <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                 {activeRegion === 'V1' && <span className="text-blue-400">Primary Visual (V1)</span>}
                 {activeRegion === 'IT' && <span className="text-purple-400">Inferotemporal (IT)</span>}
                 {activeRegion === 'PFC' && <span className="text-orange-400">Prefrontal (PFC)</span>}
                 {activeRegion === 'MOTOR' && <span className="text-green-400">Motor Cortex</span>}
               </h2>
               <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Region Analysis</div>
            </div>

            {/* Dynamic Region Content */}
            <div className="flex-1 space-y-6">
                {activeRegion === 'V1' && (
                    <>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Detected Edges</div>
                          <div className="text-blue-300 font-mono text-lg">{data.bottomUp.v1.edges}</div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Contrast Level</div>
                          <div className="text-blue-300 font-mono text-lg">{(data.bottomUp.v1.contrast * 100).toFixed(0)}%</div>
                       </div>
                    </>
                )}

                {activeRegion === 'IT' && (
                    <>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Object Label</div>
                          <div className="text-purple-300 font-mono text-2xl font-bold">{data.bottomUp.it.objectLabel}</div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Category</div>
                          <div className="text-purple-300 font-mono text-lg">{data.bottomUp.it.category}</div>
                       </div>
                    </>
                )}

                {activeRegion === 'PFC' && (
                    <>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Top-Down Prediction</div>
                          <div className="text-orange-300 font-mono text-sm leading-relaxed">"{data.topDown.pfc.prediction}"</div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Context Model</div>
                          <div className="text-orange-300 font-mono text-sm">{data.topDown.pfc.context}</div>
                       </div>
                    </>
                )}

                {activeRegion === 'MOTOR' && (
                    <>
                       <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                          <div className="text-slate-400 text-xs mb-1">Predicted Action</div>
                          <div className="text-green-300 font-mono text-xl font-bold">{data.motor.action}</div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Target</div>
                          <div className="text-green-300 font-mono text-lg">{data.motor.target}</div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Reasoning</div>
                          <div className="text-slate-300 font-mono text-xs leading-relaxed">{data.motor.reasoning}</div>
                       </div>
                    </>
                )}
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-800">
               <div className="text-[10px] text-slate-600 mb-2 uppercase">Current Activation</div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                      className={`h-full transition-all duration-300 ${
                        activeRegion === 'V1' ? 'bg-blue-500' :
                        activeRegion === 'IT' ? 'bg-purple-500' :
                        activeRegion === 'PFC' ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ 
                          width: `${
                            activeRegion === 'V1' ? data.activations.v1 :
                            activeRegion === 'IT' ? data.activations.it :
                            activeRegion === 'PFC' ? data.activations.pfc : data.activations.motor
                          }%` 
                      }}
                   />
               </div>
            </div>
        </div>
     );
  }

  // -- DEFAULT DASHBOARD VIEW --
  return (
    <div className="h-full flex flex-col bg-slate-900/50 border-l border-slate-800 p-6">
       
       {/* 1. TOP: Prediction vs Reality */}
       <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Top-Down Prediction
          </h3>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
             {data ? (
                 <div className="space-y-2">
                    <p className="text-orange-300 font-mono text-sm leading-snug">"{data.topDown.pfc.prediction}"</p>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-800/50">
                        <span className="text-xs text-slate-500">Error Score</span>
                        <span className={`font-mono font-bold ${data.metrics.predictionError > 0.4 ? 'text-red-400' : 'text-green-400'}`}>
                            {data.metrics.predictionError.toFixed(3)}
                        </span>
                    </div>
                 </div>
             ) : (
                 <div className="text-slate-600 text-xs italic">Awaiting prediction...</div>
             )}
          </div>
       </div>

       {/* 2. MIDDLE: Motor Output */}
       <div className="mb-6 flex-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Motor Output
          </h3>
          <div className={`p-4 rounded-lg border transition-all duration-500 ${data?.metrics.predictionError && data.metrics.predictionError > 0.4 ? 'bg-red-900/10 border-red-500/30' : 'bg-green-900/10 border-green-500/30'}`}>
             {data ? (
                 <div>
                    <div className="text-xs text-slate-400 mb-1">Action Plan</div>
                    <div className="text-xl font-bold text-white mb-2">{data.motor.action}</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${data.motor.confidence * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-500">Confidence</span>
                        <span className="text-[10px] text-green-400 font-mono">{(data.motor.confidence * 100).toFixed(0)}%</span>
                    </div>
                 </div>
             ) : (
                 <div className="text-slate-600 text-xs italic">Awaiting motor plan...</div>
             )}
          </div>
       </div>

       {/* 3. BOTTOM: Conscious Report */}
       <div className="mt-auto">
          <ConsciousPanel 
             percept={data?.conscious}
             finalJson={null}
             onPlayAudio={onPlayAudio}
             isPlayingAudio={isPlayingAudio}
             isProcessing={isProcessing}
          />
       </div>

    </div>
  );
};