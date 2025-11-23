package fr.kolgna_sec.portfolio_api.account.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Account - Gestion des données métier uniquement
 *
 * IMPORTANT : Après migration Keycloak :
 * - L'authentification est gérée par Keycloak (plus de UserDetailsService)
 * - Les rôles sont gérés par Keycloak (plus de gestion de roles en DB)
 * - Ce service gère uniquement les données métier (profile, CV, S3, etc.)
 */
@Service
@RequiredArgsConstructor
public class AccountService implements Webservices<AccountDTO> {

    private final AccountRepository accountRepository;

    private final AccountMapper accountMapper;

    private final UuidService uuidService;

    private final AmazonS3 amazonS3;

    @Override
    public Page<AccountDTO> all(Pageable pageable) {
        return this.accountRepository.findAll(pageable).map(this.accountMapper::fromAccount);
    }

    @Override
    public AccountDTO add(AccountDTO e) {
        Account account = this.accountMapper.fromAccountDTO(e);
        account.setRefAccount(this.uuidService.generateUuid());

        // Note : La création d'utilisateur devrait se faire via Keycloak
        // Cet endpoint devrait être utilisé uniquement pour créer les données métier
        // après qu'un utilisateur ait été créé dans Keycloak

        return this.accountMapper.fromAccount(this.accountRepository.save(account));
    }

    @Override
    public AccountDTO update(Long id, AccountDTO e) {
        return this.accountMapper.fromAccount(this.accountRepository.findById(id)
                .map(account -> {
                    if (e.getRefAccount() != null)
                        account.setRefAccount(e.getRefAccount());
                    if (e.getName() != null)
                        account.setName(e.getName());
                    if (e.getFirstName() != null)
                        account.setFirstName(e.getFirstName());
                    if (e.getEmail() != null)
                        account.setEmail(e.getEmail());
                    if (e.getPhoneNumber() != null)
                        account.setPhoneNumber(e.getPhoneNumber());
                    if (e.getCivility() != null)
                        account.setCivility(e.getCivility());
                    if (e.getGithub() != null)
                        account.setGithub(e.getGithub());
                    if (e.getLinkedin() != null)
                        account.setLinkedin(e.getLinkedin());
                    if (e.getAddress() != null)
                        account.setAddress(e.getAddress());

                    Optional.ofNullable(e.getProfileImageUrl()).ifPresent(account::setProfileImageUrl);
                    Optional.ofNullable(e.getCvUrl()).ifPresent(account::setCvUrl);

                    return this.accountRepository.save(account);
                })
                .orElseThrow(() -> new RuntimeException("Unable to retrieve Account. Please check the provided ID")));
    }

    @Override
    public void remove(Long id) {
        Optional<Account> account = this.accountRepository.findById(id);

        if (account.isEmpty())
            throw new RuntimeException("Unable to retrieve Account. Please check the provided ID");

        // Note : Penser à supprimer aussi l'utilisateur dans Keycloak si nécessaire
        this.accountRepository.delete(account.get());
    }

    @Override
    public Optional<AccountDTO> getById(Long id) {
        return this.accountRepository.findById(id)
                .map(this.accountMapper::fromAccount);
    }

    /**
     * Récupère l'ID de l'account par email
     */
    public Long getAccountIdByEmail(String email) {
        Account account = this.accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with email: " + email));
        return account.getIdAccount();
    }

    /**
     * Récupère un account par son UUID Keycloak
     */
    public Optional<Account> getAccountByKeycloakUserId(String keycloakUserId) {
        return this.accountRepository.findByKeycloakUserId(keycloakUserId);
    }

    /**
     * Récupère un account par email
     */
    public Optional<Account> getAccountByEmail(String email) {
        return this.accountRepository.findByEmail(email);
    }

    public String uploadProfileImage(Long id, MultipartFile file) throws IOException {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String key = "avatars/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        // ✅ Suppression de la ligne avec .withCannedAcl(...)
        PutObjectRequest putRequest = new PutObjectRequest(
                "kolie-portfolio-profile",
                key,
                file.getInputStream(),
                metadata
        );

        amazonS3.putObject(putRequest);

        String publicUrl = amazonS3.getUrl("kolie-portfolio-profile", key).toString();

        account.setProfileImageUrl(publicUrl);
        accountRepository.save(account);

        return publicUrl;
    }

    public String uploadCv(Long id, MultipartFile file) throws IOException {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String key = "cv/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        PutObjectRequest putRequest = new PutObjectRequest(
                "kolie-portfolio-profile",
                key,
                file.getInputStream(),
                metadata
        );

        amazonS3.putObject(putRequest);

        String publicUrl = amazonS3.getUrl("kolie-portfolio-profile", key).toString();

        account.setCvUrl(publicUrl);
        accountRepository.save(account);

        return publicUrl;
    }

    public String getCvUrl(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return account.getCvUrl();
    }


}
