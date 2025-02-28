package fr.kolgna_sec.portfolio_api.token.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDTO {

    private Long idToken;

    private String valueToken;

    private Boolean statusToken ;

    private Boolean expirationToken;

    private Long accountId;
}
