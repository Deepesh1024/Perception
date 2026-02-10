import React from 'react';
import { Activity, Zap } from 'lucide-react';
import { MotorData } from '../types';

interface Props {
  data?: MotorData;
  isProcessing: boolean;
}

export const MotorPanel: React.FC<Props> = ({ data, isProcessing }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-red-500/30 rounded-xl overflow-hidden shadow-xl w-[300px] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-red-500/10 p-3 border-b border-red-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold">
          <Activity className="w-4 h-4" />
          <span>MOTOR_CORTEX</span>
        </div>
        <span className="text-[10px] text-red-400/60 font-mono">EFFERENT</span>
      </div>

      <div className="p-4">
        {isProcessing ? (
           <div className="flex items-center gap-2 text-red-400/50 text-xs font-mono animate-pulse">
             <Zap className="w-3 h-3" /> Preparing Action Potential...
           </div>
        ) : data ? (
          <div className="space-y-4">
            <div>
               <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Planned Action</h4>
               <p className="text-lg font-bold text-white leading-tight">{data.action}</p>
            </div>
            
            <div className="space-y-2">
               <h4 className="text-[10px] text-slate-500 uppercase tracking-widest">Active Muscle Groups</h4>
               <div className="flex flex-wrap gap-1">
                  {data.muscleGroups.map((m, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-red-900/30 border border-red-500/20 text-red-200 text-xs font-mono">
                          {m}
                      </span>
                  ))}
               </div>
            </div>

            <div>
               <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                   <span>URGENCY</span>
                   <span>{(data.urgency * 100).toFixed(0)}%</span>
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-red-500 transition-all duration-500" 
                      style={{ width: `${data.urgency * 100}%` }}
                   ></div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-600 font-mono text-xs">NO MOTOR PLAN</div>
        )}
      </div>
    </div>
  );
};