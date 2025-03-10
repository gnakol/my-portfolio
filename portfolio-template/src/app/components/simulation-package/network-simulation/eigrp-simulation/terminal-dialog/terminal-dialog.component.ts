import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-terminal-dialog',
  templateUrl: './terminal-dialog.component.html',
  styleUrls: ['./terminal-dialog.component.scss'],
  imports: [CommonModule, FormsModule,
    MatIcon
  ]
})
export class TerminalDialogComponent {
  command: string = '';
  terminalOutput: string = 'Terminal EIGRP prêt.\n💡 Astuce : Tapez "router eigrp 1" pour commencer.\n';

  constructor(private dialogRef: MatDialogRef<TerminalDialogComponent>) {}

  sendCommand() {
    if (!this.command.trim()) return;

    this.terminalOutput += `> ${this.command}\n`;
    this.dialogRef.close(this.command); // Envoie la commande sans fermer le terminal
    this.command = '';
  }

  closeTerminal() {
    this.dialogRef.close();
  }
}
