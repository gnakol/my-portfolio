import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SessionResult, LeaderboardEntry } from '../models/firewall.models';
import { FirewallSimulationService } from '../services/firewall-simulation.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  @Input() result!: SessionResult;
  @Output() restart = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();

  rating: number = 0;
  feedback: string = '';
  showFeedbackForm: boolean = false;
  leaderboard: LeaderboardEntry[] = [];
  loadingLeaderboard: boolean = true;

  constructor(private firewallService: FirewallSimulationService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  /**
   * Charge le classement
   */
  loadLeaderboard(): void {
    this.firewallService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loadingLeaderboard = false;
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        this.loadingLeaderboard = false;
      }
    });
  }

  /**
   * Définit la note
   */
  setRating(stars: number): void {
    this.rating = stars;
  }

  /**
   * Soumet le feedback
   */
  submitFeedback(): void {
    // Le feedback a déjà été envoyé lors de l'endSession
    // Ici on peut juste confirmer
    this.showFeedbackForm = false;
    alert('Merci pour votre feedback ! 🙏');
  }

  /**
   * Recommence la simulation
   */
  onRestart(): void {
    this.restart.emit();
  }

  /**
   * Retour à l'accueil
   */
  onExit(): void {
    this.exit.emit();
  }

  /**
   * Retourne la classe CSS pour le grade
   */
  getGradeClass(): string {
    if (this.result.grade === 'Elite Blue Teamer') return 'grade-elite';
    if (this.result.grade === 'Senior SOC Analyst') return 'grade-senior';
    if (this.result.grade === 'SOC Analyst') return 'grade-analyst';
    return 'grade-junior';
  }

  /**
   * Retourne l'icône pour le grade
   */
  getGradeIcon(): string {
    if (this.result.grade === 'Elite Blue Teamer') return 'military_tech';
    if (this.result.grade === 'Senior SOC Analyst') return 'shield';
    if (this.result.grade === 'SOC Analyst') return 'verified_user';
    return 'security';
  }

  /**
   * Formatte le temps
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Retourne les étoiles vides pour la notation
   */
  getEmptyStars(): number[] {
    return Array(5 - this.rating).fill(0);
  }

  /**
   * Retourne les étoiles pleines
   */
  getFilledStars(): number[] {
    return Array(this.rating).fill(0);
  }
}
