package fr.kolgna_sec.portfolio_api.language.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.language.bean.Language;
import fr.kolgna_sec.portfolio_api.language.dto.LanguageDTO;
import fr.kolgna_sec.portfolio_api.language.mappers.LanguageMapper;
import fr.kolgna_sec.portfolio_api.language.repositories.LanguageRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LanguageService implements Webservices<LanguageDTO> {

    private final LanguageRepository languageRepository;

    private final LanguageMapper languageMapper;

    private final UuidService uuidService;

    private final AccountRepository accountRepository;

    @Override
    public Page<LanguageDTO> all(Pageable pageable) {
        return this.languageRepository.findAll(pageable)
                .map(this.languageMapper::fromLanguage);
    }

    // Service pour récupérer toutes les langues
    public List<LanguageDTO> getAllLanguages() {
        return this.languageRepository.findAll()
                .stream()
                .map(this.languageMapper::fromLanguage)
                .toList();
    }


    @Override
    public LanguageDTO add(LanguageDTO e) {

        Language language = this.languageMapper.fromLanguageDTO(e);

        Optional<Account> account = this.accountRepository.findById(e.getAccountId());

        if (account.isPresent())
        {
            language.setRefLanguage(this.uuidService.generateUuid());
            language.setAccount(account.get());

            return this.languageMapper.fromLanguage(this.languageRepository.save(language));
        }

        throw new RuntimeException("Unable to retrieve Account. Please check the provider ID");
    }

    @Override
    public LanguageDTO update(Long id, LanguageDTO e) {

        Optional<Account> account = this.accountRepository.findById(e.getAccountId());

        return this.languageRepository.findById(id)
                .map(existingLanguage -> {
                    Optional.ofNullable(e.getName()).ifPresent(existingLanguage::setName);
                    Optional.ofNullable(e.getProficiencyLevel()).ifPresent(existingLanguage::setProficiencyLevel);
                    Optional.of(account.get()).ifPresent(existingLanguage::setAccount);

                    return this.languageMapper.fromLanguage(this.languageRepository.save(existingLanguage));
                })
                .orElseThrow(() -> new RuntimeException("Language with ID : " +id+ " was not found"));
    }

    @Override
    public void remove(Long id) {

        Optional<Language> language = this.languageRepository.findById(id);

        if (language.isEmpty())
            throw new RuntimeException("Unable to retrieve Language. Please check the provide ID");

        this.languageRepository.delete(language.get());

    }

    @Override
    public Optional<LanguageDTO> getById(Long id) {

        return this.languageRepository.findById(id)
                .map(this.languageMapper::fromLanguage);
    }
}
