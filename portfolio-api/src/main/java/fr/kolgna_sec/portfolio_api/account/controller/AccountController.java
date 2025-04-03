package fr.kolgna_sec.portfolio_api.account.controller;

import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import fr.kolgna_sec.portfolio_api.account.dto.ChangePasswordDTO;
import fr.kolgna_sec.portfolio_api.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("account")
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/all-account")
    public ResponseEntity<Page<AccountDTO>> allAccount(Pageable pageable)
    {
        return ResponseEntity.ok(this.accountService.all(pageable));
    }

    @PostMapping(path = "/add-new-account", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AccountDTO> addAccount(@Validated @RequestBody AccountDTO accountDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.accountService.add(accountDTO));
    }

    @PutMapping("/update-account/{idAccount}")
    public ResponseEntity<AccountDTO> updateAccount(@Validated @PathVariable Long idAccount, @RequestBody AccountDTO accountDTO)
    {
        return ResponseEntity.status(202).body(this.accountService.update(idAccount, accountDTO));
    }

    @DeleteMapping("/remove-account/{idAccount}")
    public ResponseEntity<String> removeAccount(@Validated @PathVariable Long idAccount)
    {
        this.accountService.remove(idAccount);
        return ResponseEntity.status(202).body("Role with ID : " +idAccount+ " has been successfully remove");
    }

    @GetMapping("/get-by-id-account/{idAccount}")
    public ResponseEntity<AccountDTO> getByIdAccount(@Validated @PathVariable Long idAccount)
    {
        return  this.accountService.getById(idAccount)
                .map(accountDTO -> {
                    log.info("Account with ID : " +idAccount+ " has been found");
                    return new ResponseEntity<>(accountDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Account with ID : " +idAccount+ " was not found");
                    return new RuntimeException("Unable to retrieve Account. Please check provide ID");
                });
    }

    @GetMapping("get-account-id-by-email")
    public ResponseEntity<Long> getUserIdByEmail(@RequestParam String email) {
        Long userId = accountService.getAccountIdByEmail(email); // Implémentez cette méthode dans votre service
        return ResponseEntity.ok(userId);
    }

    @PutMapping("change-password")
    public ResponseEntity<?> changePassword(@Validated @RequestBody ChangePasswordDTO changePasswordDTO, Authentication authentication)
    {
        try
        {
            this.accountService.changePassword(authentication.getName(), changePasswordDTO.getOlPassword(), changePasswordDTO.getNewPassword());
            return ResponseEntity.ok().body("Password successfully updated");
        } catch (Exception e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
