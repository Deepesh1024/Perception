import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { TopDownData } from '../types';

interface Props {
  image: string | null;
  data?: TopDownData;
  isProcessing: boolean;
}

export const PredictionPanel: React.FC<Props> = ({ image, data, isProcessing }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-orange-500/30 rounded-xl overflow-hidden shadow-xl w-full flex flex-col relative animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-orange-500/10 p-3 border-b border-orange-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-orange-400 font-mono text-sm font-bold">
          <Brain className="w-4 h-4" />
          <span>PREDICTION</span>
        </div>
        <span className="text-[10px] text-orange-400/60 font-mono">TOP-DOWN</span>
      </div>

      <div className="p-4 flex flex-col items-center justify-center relative">
        {image ? (
          <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
             <img 
              src={image} 
              alt="Prediction Model" 
              className={`w-full h-full object-cover filter sepia contrast-125 brightness-50 opacity-80`} 
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`border-2 border-orange-500/30 rounded-full w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm ${isProcessing ? 'animate-ping' : ''}`}>
                    <span className="text-orange-400 font-mono text-xs font-bold">{data ? `${Math.round(data.confidence * 100)}%` : '?'}</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-600 font-mono text-[10px] py-8">NO MODEL</div>
        )}

         {/* Feature summary chips instead of list */}
        {data && !isProcessing && (
           <div className="mt-4 w-full">
             <h4 className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Expectations</h4>
             <div className="flex flex-wrap gap-2">
             {data.expectations.slice(0, 4).map((f, i) => (
                <span key={i} className="text-[10px] font-mono bg-orange-900/20 text-orange-300 px-2 py-1 rounded border border-orange-500/20">
                  {f}
                </span>
             ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};