export type SimulationPhase = 
  | 'IDLE' 
  | 'SENSORY_INTAKE'     // Retina -> V1
  | 'BOTTOM_UP'          // V1 -> IT
  | 'TOP_DOWN_PREDICTION' // PFC -> IT/V1
  | 'CORTICAL_COMPARISON' // Error Calculation
  | 'BELIEF_UPDATE'      // Updating priors
  | 'MOTOR_EXECUTION';   // Motor Cortex output

export type BrainRegion = 'V1' | 'IT' | 'PFC' | 'MOTOR' | 'NONE';

export interface BrainState {
  cycleCount: number;
  alpha: number; 
  isProcessing: boolean;
  status: SimulationPhase;
  beliefState: number[]; // Persistent vector
  ignitionHistory: { timestamp: number; value: number }[];
  simulationLog: string[];
}

export interface BottomUpData {
  v1: {
    edges: string;
    contrast: number; 
    motion: string;
  };
  it: {
    objectLabel: string;
    category: string;
    confidence: number;
  };
  featureVector: number[];
}

export interface TopDownData {
  pfc: {
    prediction: string;
    context: string;
  };
  predictedVector: number[];
}

export interface MotorData {
  action: string;
  target: string;
  confidence: number; 
  reasoning: string;
}

export interface ConsciousPercept {
  narrative: string;
  surpriseFactor: number; 
  firingRate: number; 
}

export interface BrainCycleResult {
  bottomUp: BottomUpData;
  topDown: TopDownData;
  motor: MotorData;
  activations: {
    v1: number;
    it: number;
    pfc: number;
    motor: number;
  };
  conscious: ConsciousPercept;
  metrics: {
    predictionError: number;
    cosineSimilarity: number;
    beliefUpdateDelta: number;
  };
  newBeliefState: number[];
}