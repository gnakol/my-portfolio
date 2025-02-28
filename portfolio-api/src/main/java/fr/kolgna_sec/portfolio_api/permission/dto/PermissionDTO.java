package fr.kolgna_sec.portfolio_api.permission.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionDTO {

    private Long idPermission;

    private String permissionName;
}
