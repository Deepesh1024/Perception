import React from 'react';
import { BrainRegion, BrainCycleResult } from '../types';
import { Activity, Database, Eye, Zap } from 'lucide-react';

interface Props {
  region: BrainRegion;
  data: BrainCycleResult | null;
}

export const RegionDetailPanel: React.FC<Props> = ({ region, data }) => {
  if (region === 'NONE' || !data) return null;

  const getRegionContent = () => {
    switch (region) {
      case 'V1':
        return {
          title: 'Primary Visual Cortex',
          color: 'text-blue-400',
          borderColor: 'border-blue-500',
          icon: <Eye className="w-5 h-5" />,
          stats: [
            { label: 'Edge Density', value: data.bottomUp.v1.edges },
            { label: 'Contrast', value: `${(data.bottomUp.v1.contrast * 100).toFixed(0)}%` },
            { label: 'Motion', value: data.bottomUp.v1.motion },
            { label: 'Activation', value: `${data.activations.v1}%` }
          ],
          desc: "Processes raw sensory input. Extracts feature vectors for edges, luminance, and motion direction."
        };
      case 'IT':
        return {
          title: 'Inferotemporal Cortex',
          color: 'text-purple-400',
          borderColor: 'border-purple-500',
          icon: <Database className="w-5 h-5" />,
          stats: [
            { label: 'Object', value: data.bottomUp.it.objectLabel },
            { label: 'Category', value: data.bottomUp.it.category },
            { label: 'Confidence', value: `${(data.bottomUp.it.confidence * 100).toFixed(0)}%` },
            { label: 'Activation', value: `${data.activations.it}%` }
          ],
          desc: "High-level object recognition. Matches V1 feature vectors against learned belief templates."
        };
      case 'PFC':
        return {
          title: 'Prefrontal Cortex',
          color: 'text-orange-400',
          borderColor: 'border-orange-500',
          icon: <Activity className="w-5 h-5" />,
          stats: [
            { label: 'Context', value: data.topDown.pfc.context },
            { label: 'Prediction', value: data.topDown.pfc.prediction },
            { label: 'Surprise (Error)', value: data.metrics.predictionError.toFixed(2) },
            { label: 'Activation', value: `${data.activations.pfc}%` }
          ],
          desc: "Generates top-down predictions (priors). Computes prediction error to update belief states."
        };
      case 'MOTOR':
        return {
          title: 'Motor Cortex',
          color: 'text-green-400',
          borderColor: 'border-green-500',
          icon: <Zap className="w-5 h-5" />,
          stats: [
            { label: 'Action', value: data.motor.action },
            { label: 'Target', value: data.motor.target },
            { label: 'Confidence', value: `${(data.motor.confidence * 100).toFixed(0)}%` },
            { label: 'Activation', value: `${data.activations.motor}%` }
          ],
          desc: "Executes active inference. Generates motor plans to minimize prediction error."
        };
      default:
        return null;
    }
  };

  const content = getRegionContent();
  if (!content) return null;

  return (
    <div className={`absolute right-6 top-24 w-72 bg-slate-900/95 backdrop-blur-xl border ${content.borderColor} rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-10 z-50`}>
      <div className={`flex items-center gap-2 ${content.color} font-bold border-b border-slate-700 pb-2 mb-3`}>
        {content.icon}
        <h3>{content.title}</h3>
      </div>
      
      <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
        {content.desc}
      </p>

      <div className="space-y-3">
        {content.stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-1">
            <span className="text-slate-500 uppercase">{stat.label}</span>
            <span className="text-slate-200 font-bold text-right">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Vector Visualization Mockup */}
      <div className="mt-4 pt-2 border-t border-slate-700">
        <span className="text-[10px] text-slate-600 uppercase tracking-widest">Feature Vector</span>
        <div className="flex gap-1 h-8 mt-1 items-end">
            {[0.4, 0.7, 0.2, 0.9, 0.5, 0.3].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-700 rounded-sm relative overflow-hidden">
                    <div 
                        className={`absolute bottom-0 w-full ${content.color.replace('text-', 'bg-')}`} 
                        style={{ height: `${h * 100}%`, opacity: 0.5 + (Math.random() * 0.5) }} 
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
