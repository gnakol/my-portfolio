package fr.kolgna_sec.portfolio_api.experience.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.experience.bean.Experience;
import fr.kolgna_sec.portfolio_api.experience.dto.ExperienceDTO;
import fr.kolgna_sec.portfolio_api.experience.mappers.ExperienceMapper;
import fr.kolgna_sec.portfolio_api.experience.repositories.ExperienceRepository;
import fr.kolgna_sec.portfolio_api.experience_type.bean.ExperienceType;
import fr.kolgna_sec.portfolio_api.experience_type.repositories.ExperienceTypeRepository;
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
public class ExperienceService implements Webservices<ExperienceDTO> {

    private final ExperienceRepository experienceRepository;

    private final ExperienceMapper experienceMapper;

    private final UuidService uuidService;

    private final AccountRepository accountRepository;

    private final ExperienceTypeRepository experienceTypeRepository;

    @Override
    public Page<ExperienceDTO> all(Pageable pageable) {
        return this.experienceRepository.findAll(pageable)
                .map(this.experienceMapper::fromExperience);
    }

    // Service pour récupérer toutes les expériences sauf celles de type "Projet"
    public List<ExperienceDTO> getAllNonProjectExperiences() {
        return this.experienceRepository.findAll()
                .stream()
                .filter(exp -> !exp.getExperienceType().getName().equalsIgnoreCase("Projet"))
                .map(this.experienceMapper::fromExperience)
                .toList();
    }


    // Service pour récupérer uniquement les expériences de type "Projet"
    public List<ExperienceDTO> getAllProjects() {
        return this.experienceRepository.findAll()
                .stream()
                .filter(exp -> exp.getExperienceType().getName().equalsIgnoreCase("Projet"))
                .map(this.experienceMapper::fromExperience)
                .toList();
    }


    @Override
    public ExperienceDTO add(ExperienceDTO e) {

        Experience experience = this.experienceMapper.fromExperienceDTO(e);

        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());
        Optional<ExperienceType> experienceType = this.experienceTypeRepository.findById(e.getExperienceType_id());

        if (account.isPresent() && experienceType.isPresent())
        {
            experience.setRefExperience(this.uuidService.generateUuid());
            experience.setAccount(account.get());
            experience.setExperienceType(experienceType.get());

            return this.experienceMapper.fromExperience(this.experienceRepository.save(experience));
        }

        throw new RuntimeException("Unable to retrieve Account and Experience Type. Please check the provide IDS");
    }

    @Override
    public ExperienceDTO update(Long id, ExperienceDTO e) {
        return this.experienceMapper.fromExperience(this.experienceRepository.findById(id)
                .map(experience -> {
                    if (experience.getRefExperience() == null)
                        experience.setRefExperience(this.uuidService.generateUuid());
                    if (experience.getTitle() != null)
                        experience.setTitle(e.getTitle());
                    if (experience.getDescription() != null)
                        experience.setDescription(e.getDescription());
                    if (experience.getStartDate() != null)
                        experience.setStartDate(e.getStartDate());
                    if (experience.getEndDate() != null)
                        experience.setEndDate(e.getEndDate());
                    if (experience.getCompanyName() != null)
                        experience.setCompanyName(e.getCompanyName());
                    if (experience.getAccount() != null)
                    {
                        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());

                        experience.setAccount(account.get());
                    }
                    if (experience.getExperienceType() != null)
                    {
                        Optional<ExperienceType> experienceType = this.experienceTypeRepository.findById(e.getExperienceType_id());

                        experience.setExperienceType(experienceType.get());
                    }

                    return this.experienceRepository.save(experience);
                })
                .orElseThrow(() -> new RuntimeException("Experience with ID : " +id+ " was not found")));
    }

    @Override
    public void remove(Long id) {

        Optional<Experience> experience = this.experienceRepository.findById(id);

        if (experience.isEmpty())
            throw new RuntimeException("Experience with ID : " +id+ " was not found");

        this.experienceRepository.delete(experience.get());

    }

    @Override
    public Optional<ExperienceDTO> getById(Long id) {
        return this.experienceRepository.findById(id)
                .map(this.experienceMapper::fromExperience);
    }
}
