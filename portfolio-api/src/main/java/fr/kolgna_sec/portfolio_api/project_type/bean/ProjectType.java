package fr.kolgna_sec.portfolio_api.project_type.bean;

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
@Table(name = "project_type")
public class ProjectType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_project_type")
    private Long idProjectType;

    @Column(name = "ref_project_type")
    private String refProject;

    @Column(name = "name")
    private String name;
}
