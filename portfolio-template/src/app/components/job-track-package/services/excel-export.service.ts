import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Candidacy } from '../models/candidacy.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  /**
   * Exporte les candidatures au format Excel comme le fichier de suivi
   * Structure: Contact | Candidature envoyée | 1ère Relance | Suivi (Entretien téléphonique | Entretien physique)
   */
  exportCandidacies(candidacies: Candidacy[], filename: string = 'Suivi_Candidatures.xlsx'): void {
    // Créer les données au format tableau
    const data = this.transformCandidaciesToExcelFormat(candidacies);

    // Créer le workbook et la feuille
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Feuil1': worksheet }, SheetNames: ['Feuil1'] };

    // Définir les largeurs de colonnes (pour une meilleure lisibilité)
    worksheet['!cols'] = [
      { wch: 20 }, // Nom
      { wch: 15 }, // Fonction
      { wch: 15 }, // Tel
      { wch: 25 }, // Mail
      { wch: 12 }, // Candidature Date
      { wch: 30 }, // Candidature Note
      { wch: 12 }, // 1ère Relance Date
      { wch: 30 }, // 1ère Relance Note
      { wch: 12 }, // Entretien tél Date
      { wch: 30 }, // Entretien tél Note
      { wch: 12 }, // Entretien phy Date
      { wch: 30 }, // Entretien phy Note
    ];

    // Sauvegarder le fichier
    XLSX.writeFile(workbook, filename);
  }

  /**
   * Transforme les candidatures en format Excel
   * Retourne un tableau 2D avec headers + data
   */
  private transformCandidaciesToExcelFormat(candidacies: Candidacy[]): any[][] {
    // Headers avec style (2 lignes de headers)
    const headers: any[][] = [
      [
        { v: 'Contact', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: 'C6EFCE' } } } },
        '',
        '',
        '',
        { v: 'Candidature envoyée', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: 'C6EFCE' } } } },
        '',
        { v: '1ère Relance', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: 'C6EFCE' } } } },
        '',
        { v: 'Suivi', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: 'FFFFCC' } } } },
        '',
        '',
        '',
      ],
      [
        'Nom',
        'Fonction',
        'Tel',
        'Mail',
        'Date',
        'Note',
        'Date',
        'Note',
        'Entretien téléphonique',
        'Note',
        'Entretien physique',
        'Note',
      ]
    ];

    // Data rows
    const dataRows = candidacies.map(candidacy => {
      // Application events pour trouver les entretiens
      const phoneInterview = candidacy.events?.find((e: any) => e.eventType === 'PHONE_SCREENING');
      const physicalInterview = candidacy.events?.find((e: any) =>
        e.eventType === 'INTERVIEW_SCHEDULED' || e.eventType === 'FINAL_INTERVIEW'
      );

      // Reminders pour la première relance
      const firstReminder = candidacy.reminders && candidacy.reminders.length > 0
        ? candidacy.reminders.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
        : null;

      return [
        // Contact (nom entreprise + job offer pour l'instant)
        candidacy.company?.name || '',
        candidacy.jobOffer?.title || '', // Fonction = titre du poste
        '', // Tel (vide car pas de contacts dans le modèle)
        '', // Mail (vide car pas de contacts dans le modèle)

        // Candidature envoyée
        candidacy.applicationDate ? this.formatDate(candidacy.applicationDate) : '',
        candidacy.note || '',

        // 1ère Relance
        firstReminder ? this.formatDate(firstReminder.dueDate) : '',
        firstReminder?.comment || '',

        // Entretien téléphonique
        phoneInterview ? this.formatDate(phoneInterview.eventDate) : '',
        phoneInterview?.notes || '',

        // Entretien physique
        physicalInterview ? this.formatDate(physicalInterview.eventDate) : '',
        physicalInterview?.notes || '',
      ];
    });

    // Combiner headers + data
    return [...headers, ...dataRows];
  }

  /**
   * Formate une date au format DD/MM/YYYY
   */
  private formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Exporte uniquement les candidatures filtrées/visibles (Excel)
   */
  exportFilteredCandidacies(candidacies: Candidacy[]): void {
    const filename = `Candidatures_${new Date().toISOString().split('T')[0]}.xlsx`;
    this.exportCandidacies(candidacies, filename);
  }

  /**
   * Exporte les candidatures au format PDF
   */
  exportCandidaciesToPDF(candidacies: Candidacy[], filename: string = 'Suivi_Candidatures.pdf'): void {
    // Créer un nouveau document PDF en format paysage pour avoir plus de largeur
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Titre du document
    doc.setFontSize(18);
    doc.setTextColor(139, 92, 246); // Violet
    doc.text('Suivi des Candidatures', 14, 15);

    // Date d'export
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Exporté le ${this.formatDate(new Date())}`, 14, 22);

    // Préparer les données du tableau
    const tableData = candidacies.map(candidacy => {
      // Application events pour trouver les entretiens
      const phoneInterview = candidacy.events?.find((e: any) => e.eventType === 'PHONE_SCREENING');
      const physicalInterview = candidacy.events?.find((e: any) =>
        e.eventType === 'INTERVIEW_SCHEDULED' || e.eventType === 'FINAL_INTERVIEW'
      );

      // Reminders pour la première relance
      const firstReminder = candidacy.reminders && candidacy.reminders.length > 0
        ? candidacy.reminders.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
        : null;

      return [
        candidacy.company?.name || '-',
        candidacy.jobOffer?.title || '-',
        candidacy.applicationDate ? this.formatDate(candidacy.applicationDate) : '-',
        candidacy.note || '-',
        firstReminder ? this.formatDate(firstReminder.dueDate) : '-',
        phoneInterview ? this.formatDate(phoneInterview.eventDate) : '-',
        physicalInterview ? this.formatDate(physicalInterview.eventDate) : '-',
        candidacy.currentStatus || '-',
      ];
    });

    // Générer le tableau avec autoTable
    autoTable(doc, {
      startY: 28,
      head: [[
        'Entreprise',
        'Poste',
        'Date candidature',
        'Note',
        '1ère Relance',
        'Entretien Tél',
        'Entretien Phy',
        'Statut',
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [139, 92, 246], // Violet
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250],
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Entreprise
        1: { cellWidth: 40 }, // Poste
        2: { cellWidth: 25 }, // Date candidature
        3: { cellWidth: 35 }, // Note
        4: { cellWidth: 25 }, // 1ère Relance
        5: { cellWidth: 25 }, // Entretien Tél
        6: { cellWidth: 25 }, // Entretien Phy
        7: { cellWidth: 30 }, // Statut
      },
      margin: { left: 14, right: 14 },
    });

    // Pied de page avec nombre de candidatures
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i}/${pageCount} - ${candidacies.length} candidature(s)`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Sauvegarder le PDF
    doc.save(filename);
  }

  /**
   * Exporte uniquement les candidatures filtrées/visibles (PDF)
   */
  exportFilteredCandidaciesToPDF(candidacies: Candidacy[]): void {
    const filename = `Candidatures_${new Date().toISOString().split('T')[0]}.pdf`;
    this.exportCandidaciesToPDF(candidacies, filename);
  }
}
