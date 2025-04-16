package fr.kolgna_sec.portfolio_api.project_type.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectTypeDTO {

    private Long idProjectType;

    private String refProject;

    private String name;
}
