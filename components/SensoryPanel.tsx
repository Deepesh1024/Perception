import React from 'react';
import { Eye, ScanLine } from 'lucide-react';
import { BottomUpData } from '../types';

interface Props {
  image: string | null;
  data?: BottomUpData;
  isProcessing: boolean;
}

export const SensoryPanel: React.FC<Props> = ({ image, data, isProcessing }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase mb-4 tracking-widest">
        <Eye className="w-4 h-4" />
        Retinal Input
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative w-full aspect-square bg-black border border-slate-800 rounded-lg overflow-hidden mb-6 group">
            {image ? (
                <>
                <img 
                    src={image} 
                    alt="Sensory Input" 
                    className={`w-full h-full object-contain ${isProcessing ? 'opacity-70 blur-[1px]' : 'opacity-100'}`} 
                />
                {isProcessing && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <ScanLine className="w-8 h-8 mb-2 opacity-50" />
                    <div className="text-xs font-mono">NO SIGNAL</div>
                </div>
            )}
        </div>

        {/* V1 Quick Stats */}
        {data && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">V1 Feature Extraction</div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Contrast</span>
                        <span className="text-blue-300 font-mono">{(data.v1.contrast * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                         <span className="text-slate-400">Features</span>
                         <span className="text-blue-300 font-mono text-right truncate max-w-[120px]">{data.v1.edges}</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};