import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from '../../../services/simulation.service';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class FeedBackComponent {

  @Input() experienceName: string = 'Configuration VLAN';

  selectedFeedback: string | null = null;

  feedbackOptions = [
    { label: '👍 Super', value: 'positive' },
    { label: '🤔 Intéressant', value: 'neutral' },
    { label: '👎 Pas clair', value: 'negative' }
  ];

  constructor(private simulationService : SimulationService, private dialogRef: MatDialogRef<FeedBackComponent>) { }

  submitFeedback() {
    if (!this.selectedFeedback) return;

    const feedback = {
      experienceName: this.experienceName,
      feedbackType: 'emoji',
      feedbackValue: this.selectedFeedback
    };

    this.simulationService.addFeedback(feedback).subscribe(
      () => {
        alert('Merci pour votre retour !');
        this.dialogRef.close();
      },
      (error) => {
        // console.error('Erreur lors de l\'envoi du feedback :', error);
        alert('Une erreur est survenue. Merci de réessayer.');
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
