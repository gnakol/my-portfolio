// Modèles pour la simulation VLAN (frontend)

export interface StartSessionRequest {
  type: 'VLAN' | 'EIGRP' | 'DHCP' | 'FIREWALL';
  clientHash: string;
  userAgent: string;
}

export interface StartSessionResponse {
  sessionId: number;
  startedAt: string;
}

export interface SendCommandRequest {
  rawCommand: string;
}

export interface SendCommandResponse {
  status: 'OK' | 'KO';
  stepIndex: number;
  message: string;
  animationCue?: string;
}

export interface FinishSessionResponse {
  score: number;
  durationMs: number;
  success: boolean;
}

export interface SaveFeedbackRequest {
  experienceName: string;
  feedbackType: string;
  feedbackValue: string;
}

export interface SaveFeedbackResponse {
  ok: boolean;
}

export interface SimulationState {
  sessionId: number | null;
  currentStep: number;
  startedAt: number | null;
  commandHistory: CommandHistoryItem[];
  isFinished: boolean;
}

export interface CommandHistoryItem {
  command: string;
  status: 'OK' | 'KO';
  message: string;
  timestamp: number;
  animationCue?: string;
}
