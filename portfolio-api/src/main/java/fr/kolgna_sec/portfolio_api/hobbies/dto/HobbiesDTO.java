package fr.kolgna_sec.portfolio_api.hobbies.dto;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HobbiesDTO {

    private Long idHobbies;

    private String refHobby;

    private String name;

    private String description;

    private Long account_id;
}
