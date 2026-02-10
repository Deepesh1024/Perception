import React from 'react';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { BrainCycleResult } from '../types';

interface Props {
  metrics: BrainCycleResult['metrics'] | undefined;
  firingRate: number | undefined;
}

export const NeuralMetricsPanel: React.FC<Props> = ({ metrics, firingRate }) => {
  if (!metrics) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur border-t border-slate-800 p-4 flex items-center justify-between gap-6 text-xs font-mono">
      {/* Neural Firing Rate */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-full">
            <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">Firing Rate</div>
            <div className="text-lg font-bold text-cyan-300 flex items-baseline gap-1">
                {firingRate || 0} <span className="text-xs font-normal text-slate-500">Hz</span>
            </div>
        </div>
      </div>

      {/* Prediction Error (Surprise) */}
      <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
        <div className="p-2 bg-slate-800 rounded-full">
            <Zap className={`w-4 h-4 ${metrics.predictionError > 0.45 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
        </div>
        <div>
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">Prediction Error</div>
            <div className={`text-lg font-bold flex items-baseline gap-1 ${metrics.predictionError > 0.45 ? 'text-red-400' : 'text-amber-300'}`}>
                {metrics.predictionError.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 1.0</span>
            </div>
        </div>
      </div>

      {/* Belief Update */}
      <div className="flex items-center gap-3 border-l border-slate-800 pl-6 pr-6">
        <div className="p-2 bg-slate-800 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-400" />
        </div>
        <div>
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">Belief Update</div>
            <div className="text-lg font-bold text-green-300 flex items-baseline gap-1">
                +{metrics.beliefUpdateDelta.toFixed(3)} <span className="text-xs font-normal text-slate-500">mag</span>
            </div>
        </div>
      </div>
    </div>
  );
};
