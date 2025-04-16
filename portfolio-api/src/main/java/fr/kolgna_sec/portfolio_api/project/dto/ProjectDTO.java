package fr.kolgna_sec.portfolio_api.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDTO {

    private Long idProject;

    private String refProject;

    private String title;

    private String description;

    private Date startDate;

    private Date endDate;

    private String skillsDevelopment;

    private Long projectTypeId;

    private Long accountId;
}
