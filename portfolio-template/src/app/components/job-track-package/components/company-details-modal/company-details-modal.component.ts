import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './company-details-modal.component.html',
  styleUrls: ['./company-details-modal.component.scss']
})
export class CompanyDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CompanyDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public company: Company
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', company: this.company });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', company: this.company });
  }

  openWebsite(): void {
    if (this.company.website) {
      const url = this.company.website.startsWith('http')
        ? this.company.website
        : `https://${this.company.website}`;
      window.open(url, '_blank');
    }
  }

  getSectorIcon(sector?: string): string {
    if (!sector) return 'business';

    const sectorLower = sector.toLowerCase();
    if (sectorLower.includes('tech') || sectorLower.includes('it')) return 'computer';
    if (sectorLower.includes('finance') || sectorLower.includes('banque')) return 'account_balance';
    if (sectorLower.includes('santé') || sectorLower.includes('health')) return 'local_hospital';
    if (sectorLower.includes('éducation') || sectorLower.includes('education')) return 'school';
    if (sectorLower.includes('commerce') || sectorLower.includes('retail')) return 'shopping_cart';
    if (sectorLower.includes('industrie') || sectorLower.includes('manufacturing')) return 'factory';

    return 'business';
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
