import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SimulationState, CommandHistoryItem } from '../models/simulation.models';

@Injectable({
  providedIn: 'root'
})
export class SimulationStateService {
  private readonly STORAGE_KEY = 'vlan-sim-state';

  private initialState: SimulationState = {
    sessionId: null,
    currentStep: 0,
    startedAt: null,
    commandHistory: [],
    isFinished: false
  };

  private stateSubject = new BehaviorSubject<SimulationState>(this.initialState);
  public state$: Observable<SimulationState> = this.stateSubject.asObservable();

  constructor() {
    this.loadState();
  }

  // Getters
  get currentState(): SimulationState {
    return this.stateSubject.value;
  }

  get sessionId(): number | null {
    return this.currentState.sessionId;
  }

  get currentStep(): number {
    return this.currentState.currentStep;
  }

  get isSessionActive(): boolean {
    return this.currentState.sessionId !== null && !this.currentState.isFinished;
  }

  // Initialiser une nouvelle session
  initSession(sessionId: number): void {
    const newState: SimulationState = {
      sessionId,
      currentStep: 0,
      startedAt: Date.now(),
      commandHistory: [],
      isFinished: false
    };
    this.updateState(newState);
  }

  // Ajouter une commande à l'historique
  addCommand(item: CommandHistoryItem): void {
    const state = this.currentState;
    const newHistory = [...state.commandHistory, item];

    // Incrémenter le step si la commande est OK
    const newStep = item.status === 'OK' ? state.currentStep + 1 : state.currentStep;

    this.updateState({
      ...state,
      currentStep: newStep,
      commandHistory: newHistory
    });
  }

  // Marquer la session comme terminée
  finishSession(): void {
    const state = this.currentState;
    this.updateState({
      ...state,
      isFinished: true
    });
  }

  // Obtenir la durée de la session (en ms)
  getSessionDuration(): number {
    const state = this.currentState;
    if (!state.startedAt) return 0;
    return Date.now() - state.startedAt;
  }

  // Obtenir les stats
  getStats(): { okCount: number; koCount: number; totalCommands: number } {
    const history = this.currentState.commandHistory;
    return {
      okCount: history.filter(h => h.status === 'OK').length,
      koCount: history.filter(h => h.status === 'KO').length,
      totalCommands: history.length
    };
  }

  // Réinitialiser l'état
  reset(): void {
    this.updateState(this.initialState);
    this.clearStorage();
  }

  // Méthodes privées pour la persistence
  private updateState(newState: SimulationState): void {
    this.stateSubject.next(newState);
    this.saveState(newState);
  }

  private saveState(state: SimulationState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error);
    }
  }

  private loadState(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored) as SimulationState;
        // Ne charger que si la session n'est pas terminée
        if (state.sessionId && !state.isFinished) {
          this.stateSubject.next(state);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état:', error);
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors du nettoyage du storage:', error);
    }
  }

  // Générer un client hash (basé sur UA + screen + langue)
  generateClientHash(): string {
    const data = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      navigator.language
    ].join('|');

    // Simple hash (dans un vrai projet, utiliser crypto-js ou similaire)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
