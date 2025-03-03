package fr.kolgna_sec.portfolio_api.cv_generate.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import fr.kolgna_sec.portfolio_api.establishment.service.EstablishmentService;
import fr.kolgna_sec.portfolio_api.experience.dto.ExperienceDTO;
import fr.kolgna_sec.portfolio_api.experience.service.ExperienceService;
import fr.kolgna_sec.portfolio_api.experience_type.service.ExperienceTypeService;
import fr.kolgna_sec.portfolio_api.hobbies.dto.HobbiesDTO;
import fr.kolgna_sec.portfolio_api.hobbies.service.HobbiesService;
import fr.kolgna_sec.portfolio_api.language.dto.LanguageDTO;
import fr.kolgna_sec.portfolio_api.language.service.LanguageService;
import fr.kolgna_sec.portfolio_api.skill.dto.SkillDTO;
import fr.kolgna_sec.portfolio_api.skill.service.SkillService;
import fr.kolgna_sec.portfolio_api.skill_categori.service.SkillCategoryService;
import fr.kolgna_sec.portfolio_api.training.dto.TrainingDTO;
import fr.kolgna_sec.portfolio_api.training.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CvService {

    private final ExperienceService experienceService;
    private final SkillService skillService;
    private final TrainingService trainingService;
    private final HobbiesService hobbiesService;
    private final LanguageService languageService;
    private final ExperienceTypeService experienceTypeService;
    private final SkillCategoryService skillCategoryService;
    private final EstablishmentService establishmentService;

    public ByteArrayInputStream generateCvPdf() {
        Document document = new Document(PageSize.A4, 20, 20, 20, 20); // Marges réduites
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            // Enregistrer la police Roboto depuis les ressources
            FontFactory.register(new ClassPathResource("fonts/Roboto-Regular.ttf").getURL().toString(), "Roboto");

            PdfWriter.getInstance(document, out);
            document.open();

            // 🟢 Barre latérale colorée avec les informations personnelles
            addSidebar(document);

            // 🟢 Mise en page en deux colonnes
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 7}); // 30% - 70%
            table.setSpacingBefore(10);

            // Colonne gauche : Formations, Compétences, Centres d'intérêt, Langues
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(getTrainingSection());
            leftCell.addElement(getSkillSection());
            leftCell.addElement(getHobbiesSection());
            leftCell.addElement(getLanguageSection());

            // Colonne droite : Expériences Professionnelles, Projets
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.addElement(getExperienceSection());
            rightCell.addElement(getProjectSection());

            table.addCell(leftCell);
            table.addCell(rightCell);

            document.add(table);
            document.close();

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // 🟢 Méthode pour la barre latérale colorée
    private void addSidebar(Document document) throws DocumentException, IOException {
        PdfPTable sidebar = new PdfPTable(1);
        sidebar.setWidthPercentage(20);
        sidebar.setHorizontalAlignment(Element.ALIGN_LEFT);
        sidebar.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        sidebar.getDefaultCell().setBackgroundColor(new BaseColor(33, 150, 243)); // Bleu moderne

        // Informations personnelles dans la barre latérale
        Paragraph personalInfo = new Paragraph();
        personalInfo.add(new Chunk("N'GNA KOLIE\n", FontFactory.getFont("Roboto", 14, Font.BOLD, BaseColor.WHITE)));
        personalInfo.add(new Chunk("Développeur FullStack\n", FontFactory.getFont("Roboto", 10, Font.NORMAL, BaseColor.WHITE)));
        personalInfo.add(new Chunk("Email : gna.kolie@yahoo.fr\n", FontFactory.getFont("Roboto", 8, Font.NORMAL, BaseColor.WHITE)));
        personalInfo.add(new Chunk("LinkedIn : linkedin.com/in/ngnakolie\n", FontFactory.getFont("Roboto", 8, Font.NORMAL, BaseColor.WHITE)));
        personalInfo.add(new Chunk("GitHub : github.com/ngnakolie\n", FontFactory.getFont("Roboto", 8, Font.NORMAL, BaseColor.WHITE)));
        personalInfo.add(new Chunk("Adresse : 10 rue Utrillo, Arras", FontFactory.getFont("Roboto", 8, Font.NORMAL, BaseColor.WHITE)));

        PdfPCell sidebarCell = new PdfPCell(personalInfo);
        sidebarCell.setBorder(Rectangle.NO_BORDER);
        sidebarCell.setPadding(10);
        sidebar.addCell(sidebarCell);

        document.add(sidebar);
    }

    // 🟢 Section Expériences Professionnelles
    private PdfPTable getExperienceSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("📄 Expériences Professionnelles", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        experienceService.getAllNonProjectExperiences().forEach(exp -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph title = new Paragraph(exp.getTitle(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph company = new Paragraph(exp.getCompanyName(), FontFactory.getFont("Roboto", 10, Font.ITALIC));
            Paragraph period = new Paragraph(exp.getStartDate() + " - " + (exp.getEndDate() != null ? exp.getEndDate() : "Présent"), FontFactory.getFont("Roboto", 8));
            Paragraph description = new Paragraph(exp.getDescription(), FontFactory.getFont("Roboto", 8));

            cell.addElement(title);
            cell.addElement(company);
            cell.addElement(period);
            cell.addElement(description);
            table.addCell(cell);
        });

        return table;
    }

    // 🟢 Section Projets
    private PdfPTable getProjectSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("🚀 Projets", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        experienceService.getAllProjects().forEach(project -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph title = new Paragraph(project.getTitle(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph company = new Paragraph(project.getCompanyName(), FontFactory.getFont("Roboto", 10, Font.ITALIC));
            Paragraph period = new Paragraph(project.getStartDate() + " - " + (project.getEndDate() != null ? project.getEndDate() : "Présent"), FontFactory.getFont("Roboto", 8));
            Paragraph description = new Paragraph(project.getDescription(), FontFactory.getFont("Roboto", 8));

            cell.addElement(title);
            cell.addElement(company);
            cell.addElement(period);
            cell.addElement(description);
            table.addCell(cell);
        });

        return table;
    }

    // 🟢 Section Compétences
    private PdfPTable getSkillSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("⚡ Compétences", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        skillService.getAllSkills().forEach(skill -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph name = new Paragraph(skill.getName(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph description = new Paragraph(skill.getDescription(), FontFactory.getFont("Roboto", 8));

            cell.addElement(name);
            cell.addElement(description);
            table.addCell(cell);
        });

        return table;
    }

    // 🟢 Section Formations
    private PdfPTable getTrainingSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("🎓 Formations", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        trainingService.getAllTrainings().forEach(training -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph label = new Paragraph(training.getLabel(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph diploma = new Paragraph("Diplôme : " + training.getDiploma(), FontFactory.getFont("Roboto", 8));

            cell.addElement(label);
            cell.addElement(diploma);
            table.addCell(cell);
        });

        return table;
    }

    // 🟢 Section Centres d'intérêt
    private PdfPTable getHobbiesSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("🎭 Centres d'intérêt", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        hobbiesService.getAllHobbies().forEach(hobby -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph name = new Paragraph(hobby.getName(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph description = new Paragraph(hobby.getDescription(), FontFactory.getFont("Roboto", 8));

            cell.addElement(name);
            cell.addElement(description);
            table.addCell(cell);
        });

        return table;
    }

    // 🟢 Section Langues
    private PdfPTable getLanguageSection() throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        PdfPCell headerCell = new PdfPCell(new Phrase("🌍 Langues", FontFactory.getFont("Roboto", 12, Font.BOLD, BaseColor.BLUE)));
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setPaddingBottom(5);
        table.addCell(headerCell);

        languageService.getAllLanguages().forEach(language -> {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setPadding(2);

            Paragraph name = new Paragraph(language.getName(), FontFactory.getFont("Roboto", 10, Font.BOLD));
            Paragraph level = new Paragraph("Niveau : " + language.getProficiencyLevel(), FontFactory.getFont("Roboto", 8));

            cell.addElement(name);
            cell.addElement(level);
            table.addCell(cell);
        });

        return table;
    }
}