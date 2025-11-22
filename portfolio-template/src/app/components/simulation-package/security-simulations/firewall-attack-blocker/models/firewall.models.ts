export interface SessionStartRequest {
  playerPseudo?: string;
  visitorIp?: string;
}

export interface SessionStartResponse {
  sessionUuid: string;
  startedAt: string;
  scenario: string;
  initialAttacks: AttackEvent[];
}

export interface AttackEvent {
  id: number;
  attackType: string;
  sourceIp: string;
  sourceCountry: string;
  targetPort: number;
  protocol: string;
  requestsPerSecond: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isBlocked: boolean;
  detectedAt: string;
}

export interface FirewallRule {
  sessionUuid: string;
  ruleCommand: string;
  ruleType: 'block' | 'allow' | 'rate-limit' | 'drop';
  targetIp?: string;
  targetPort?: number;
  protocol?: string;
}

export interface RuleExecutionResponse {
  success: boolean;
  message: string;
  attacksBlocked: number;
  scoreGained: number;
  currentScore: number;
  blockedAttackIds: number[];
}

export interface SessionEndRequest {
  sessionUuid: string;
  rating?: number;
  feedback?: string;
}

export interface SessionResult {
  sessionUuid: string;
  finalScore: number;
  grade: string;
  attacksBlocked: number;
  totalAttacks: number;
  blockRate: number;
  durationSeconds: number;
  moneySaved: number;
  rulesCreated: number;
  isTop10: boolean;
  leaderboardRank: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerPseudo: string;
  finalScore: number;
  grade: string;
  blockRate: number;
  completionTimeSeconds: number;
  achievedAt: string;
}

export interface GameState {
  sessionUuid: string;
  currentScore: number;
  attacksBlocked: number;
  totalAttacks: number;
  rulesCreated: number;
  timeRemaining: number;
  isRunning: boolean;
  activeAttacks: AttackEvent[];
}
