import React from 'react';
import { MessageSquare, Volume2, Mic } from 'lucide-react';
import { ConsciousPercept } from '../types';

interface Props {
  percept?: ConsciousPercept;
  finalJson?: any;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
  isProcessing: boolean;
}

export const ConsciousPanel: React.FC<Props> = ({ percept, finalJson, onPlayAudio, isPlayingAudio, isProcessing }) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-green-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-green-500/10 p-3 border-b border-green-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-green-400 font-mono text-sm font-bold">
          <MessageSquare className="w-4 h-4" />
          <span>CONSCIOUS_REPORT</span>
        </div>
        <span className="text-[10px] text-green-400/60 font-mono">GLOBAL WORKSPACE</span>
      </div>

      <div className="p-5 flex flex-col gap-4">
         <div className="w-full">
            {isProcessing ? (
                <div className="flex items-center gap-2 text-green-500/50 animate-pulse font-mono text-xs py-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                    FUSING PERCEPTS...
                </div>
            ) : percept ? (
                <div className="space-y-3">
                    <p className="font-mono text-green-300 text-sm leading-relaxed border-l-2 border-green-500/50 pl-3">
                        "{percept.narrative || percept.explanation}"
                    </p>
                </div>
            ) : (
                <div className="text-slate-600 font-mono text-xs py-2">
                    AWAITING CONSCIOUSNESS
                </div>
            )}
         </div>

         {/* Actions */}
         <div className="flex justify-end">
             <button 
                onClick={onPlayAudio}
                disabled={!percept || isPlayingAudio || isProcessing}
                className={`flex items-center gap-2 text-[10px] font-bold border px-3 py-2 rounded transition-all
                    ${isPlayingAudio 
                        ? 'bg-green-500/20 text-green-300 border-green-500/50 animate-pulse' 
                        : !percept 
                            ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                            : 'text-green-400 hover:text-green-300 border-green-500/30 bg-green-900/10 hover:bg-green-900/30'}`}
            >
                {isPlayingAudio ? (
                    <>
                        <Mic className="w-3 h-3 animate-pulse" />
                        SPEAKING...
                    </>
                ) : (
                    <>
                        <Volume2 className="w-3 h-3" />
                        VOCALIZE
                    </>
                )}
            </button>
         </div>
      </div>
    </div>
  );
};