import React, { useState, useRef } from 'react';
import { Brain, Upload, Play, Activity } from 'lucide-react';
import { BrainVisualizer } from './components/BrainVisualizer';
import { SensoryPanel } from './components/SensoryPanel';
import { SimulationRightPanel } from './components/SimulationRightPanel';
import { NeuralMetricsPanel } from './components/NeuralMetricsPanel';
import { BrainState, BrainCycleResult, BrainRegion, SimulationPhase } from './types';
import { runBrainCycle, generateVoice } from './services/geminiService';
import { decodeBase64, decodeAudioData } from './utils/audioUtils';

const INITIAL_STATE: BrainState = {
  cycleCount: 0,
  alpha: 0.5,
  isProcessing: false,
  status: 'IDLE',
  beliefState: [0.5, 0.5, 0.5, 0.5], 
  ignitionHistory: [],
  simulationLog: ["System Initialized. Awaiting sensory input."]
};

export default function App() {
  const [brainState, setBrainState] = useState<BrainState>(INITIAL_STATE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<BrainCycleResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeRegion, setActiveRegion] = useState<BrainRegion>('NONE');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setLastResult(null); 
        setIsPlayingAudio(false);
        setBrainState(prev => ({ ...prev, status: 'IDLE' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunCycle = async () => {
    if (!selectedImage) return;

    setBrainState(prev => ({ ...prev, isProcessing: true, status: 'SENSORY_INTAKE' }));

    try {
      // --- PHASE 1: SENSORY INTAKE ---
      // UI allows 1.5s for "Retina -> V1" animation
      
      const result = await runBrainCycle(selectedImage, brainState.beliefState, brainState.alpha);
      
      // --- PHASE 2: BOTTOM UP (V1 -> IT) ---
      setBrainState(prev => ({ ...prev, status: 'BOTTOM_UP' }));
      await new Promise(r => setTimeout(r, 1000));

      // --- PHASE 3: TOP DOWN (PFC -> IT) ---
      setBrainState(prev => ({ ...prev, status: 'TOP_DOWN_PREDICTION' }));
      await new Promise(r => setTimeout(r, 1200));

      // --- PHASE 4: COMPARISON (Error) ---
      setBrainState(prev => ({ ...prev, status: 'CORTICAL_COMPARISON' }));
      await new Promise(r => setTimeout(r, 800));

      // --- PHASE 5: UPDATE & MOTOR ---
      setBrainState(prev => ({ ...prev, status: 'MOTOR_EXECUTION' }));
      
      // Update State with Results
      const newLogEntry = `Cycle ${brainState.cycleCount + 1}: Error ${result.metrics.predictionError.toFixed(2)} → Belief Updated → Motor: ${result.motor.action}`;

      setLastResult(result);
      setBrainState(prev => ({
        ...prev,
        cycleCount: prev.cycleCount + 1,
        isProcessing: false,
        beliefState: result.newBeliefState,
        simulationLog: [newLogEntry, ...prev.simulationLog].slice(0, 5)
      }));

    } catch (error) {
      console.error("Simulation Failed:", error);
      setBrainState(prev => ({ ...prev, isProcessing: false, status: 'IDLE' }));
    }
  };

  const handleGenerateVoice = async () => {
    const textToSpeak = lastResult?.conscious.narrative;
    if (!textToSpeak || isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    try {
        const audioBase64 = await generateVoice(textToSpeak);
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const outputNode = audioContext.createGain();
        outputNode.connect(audioContext.destination);
        const pcmBytes = decodeBase64(audioBase64);
        const audioBuffer = await decodeAudioData(pcmBytes, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputNode);
        source.start();
        source.onended = () => {
            setIsPlayingAudio(false);
            audioContext.close();
        };
    } catch (e) {
        setIsPlayingAudio(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 flex justify-between items-center px-6 z-20">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Active Inference Engine</h1>
            </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Phase</div>
              <div className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
                 brainState.status === 'IDLE' ? 'border-slate-800 text-slate-500 bg-slate-900' : 
                 brainState.status === 'CORTICAL_COMPARISON' ? 'border-red-500/50 text-red-400 bg-red-900/20 animate-pulse' :
                 'border-indigo-500/50 text-indigo-400 bg-indigo-900/20'
              }`}>
                 {brainState.status.replace(/_/g, " ")}
              </div>
           </div>

           <div className="h-6 w-px bg-slate-800"></div>

           <div className="flex gap-2">
             <button
                onClick={() => fileInputRef.current?.click()}
                disabled={brainState.isProcessing}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded border border-slate-700 transition-colors"
              >
                Input Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              
              <button
                onClick={handleRunCycle}
                disabled={!selectedImage || brainState.isProcessing}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded transition-all shadow-lg 
                  ${!selectedImage || brainState.isProcessing 
                    ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-indigo-500/20'}`}
              >
                {brainState.isProcessing ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                SIMULATE
              </button>
           </div>
        </div>
      </header>

      {/* 3-COLUMN MAIN LAYOUT */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
         
         {/* LEFT: Sensory (25%) */}
         <div className="col-span-3 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-center relative z-10">
            <SensoryPanel 
                image={selectedImage} 
                data={lastResult?.bottomUp} 
                isProcessing={brainState.isProcessing} 
            />
         </div>

         {/* CENTER: Brain Simulation (50%) */}
         <div className="col-span-6 relative bg-slate-950 flex flex-col">
            {/* Top Metrics Bar */}
            <div className="absolute top-0 left-0 w-full z-10">
                <NeuralMetricsPanel 
                    metrics={lastResult?.metrics} 
                    firingRate={lastResult?.conscious.firingRate} 
                />
            </div>

            {/* Visualization */}
            <div className="flex-1 relative">
                <BrainVisualizer 
                    data={lastResult}
                    activeRegion={activeRegion}
                    onRegionHover={setActiveRegion}
                    onRegionClick={(r) => activeRegion === r ? setActiveRegion('NONE') : setActiveRegion(r)}
                    status={brainState.status}
                />
            </div>
         </div>

         {/* RIGHT: Dashboard (25%) */}
         <div className="col-span-3 bg-slate-950 border-l border-slate-800 relative z-10 h-full overflow-hidden">
             <SimulationRightPanel 
                data={lastResult}
                activeRegion={activeRegion}
                isProcessing={brainState.isProcessing}
                onPlayAudio={handleGenerateVoice}
                isPlayingAudio={isPlayingAudio}
             />
         </div>
      </main>
    </div>
  );
}