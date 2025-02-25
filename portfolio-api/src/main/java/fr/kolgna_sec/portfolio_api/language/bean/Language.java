package fr.kolgna_sec.portfolio_api.language.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "language")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_language")
    private Long idLanguage;

    @Column(name = "ref_language")
    private String refLanguage;

    @Column(name = "name")
    private String name;

    @Column(name = "proficiency_level")
    private String proficiencyLevel;
}
