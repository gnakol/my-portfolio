package fr.kolgna_sec.portfolio_api.token.controller;

import fr.kolgna_sec.portfolio_api.token.dto.TokenDTO;
import fr.kolgna_sec.portfolio_api.token.service.TokenBeanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("token")
public class TokenController {

    private final TokenBeanService tokenService;

    @GetMapping("all-token")
    public ResponseEntity<Page<TokenDTO>> allToken(Pageable pageable)
    {
        return ResponseEntity.ok(this.tokenService.allToken(pageable));
    }

    @DeleteMapping("remove-all-token")
    public ResponseEntity<String> removeAllToken()
    {
        //this.beanTokenService.removeToken();

        return ResponseEntity.ok("Remove all token was successfully");
    }

/*    @PostMapping("validate-token")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean isValid = tokenService.validateToken(token);
        return ResponseEntity.ok(Map.of("isValid", isValid));
    }*/

    @DeleteMapping("remove-token-by-id/{idToken}")
    public ResponseEntity<String> removeTokenById(@Validated @PathVariable Long idToken)
    {
        this.tokenService.removeTokenById(idToken);

        return ResponseEntity.ok("Token was successfully remove");
    }

    @DeleteMapping("remove-token-by-range/{idToken}")
    public ResponseEntity<String> removeTokenByRange(@Validated @PathVariable Long startId, @PathVariable Long endId)
    {
        this.tokenService.removeTokenByRange(startId, endId);

        return ResponseEntity.ok("Token was successfully remove by range");
    }

    @DeleteMapping("remove-token-by-choose-id")
    public ResponseEntity<String> removeTokenById(@Validated @RequestBody List<Long> ids)
    {
        this.tokenService.removeTokenByCheckId(ids);

        return ResponseEntity.ok("Token was successfully remove by check id");
    }
}
