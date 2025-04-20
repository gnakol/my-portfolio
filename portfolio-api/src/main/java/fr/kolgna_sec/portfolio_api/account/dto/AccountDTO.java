package fr.kolgna_sec.portfolio_api.account.dto;

import fr.kolgna_sec.portfolio_api.role.dto.RoleDTO;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AccountDTO {

    private Long idAccount;

    private String refAccount;

    private String name;

    private String firstName;

    private String email;

    private String password;

    private Long phoneNumber;

    private String civility;

    private String github;

    private String linkedin;

    private String address;

    private String profileImageUrl;

    private List<RoleDTO> roleDTOS;

    private String cvUrl;
}
