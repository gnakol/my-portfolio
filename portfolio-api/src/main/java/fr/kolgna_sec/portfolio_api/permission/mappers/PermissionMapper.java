package fr.kolgna_sec.portfolio_api.permission.mappers;

import fr.kolgna_sec.portfolio_api.permission.bean.Permission;
import fr.kolgna_sec.portfolio_api.permission.dto.PermissionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionDTO fromPermission(Permission permission);

    Permission fromPermissionDTO(PermissionDTO permissionDTO);
}
