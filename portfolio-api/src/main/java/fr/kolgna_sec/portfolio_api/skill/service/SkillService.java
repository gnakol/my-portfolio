package fr.kolgna_sec.portfolio_api.skill.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.skill.bean.Skill;
import fr.kolgna_sec.portfolio_api.skill.dto.SkillDTO;
import fr.kolgna_sec.portfolio_api.skill.mappers.SkillMapper;
import fr.kolgna_sec.portfolio_api.skill.repositories.SkillRepository;
import fr.kolgna_sec.portfolio_api.skill_categori.bean.SkillCategory;
import fr.kolgna_sec.portfolio_api.skill_categori.repositories.SkillCategoryRepository;
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
public class SkillService implements Webservices<SkillDTO> {

    private final SkillRepository skillRepository;

    private final SkillMapper skillMapper;

    private final UuidService uuidService;

    private final SkillCategoryRepository skillCategoryRepository;

    private final AccountRepository accountRepository;

    @Override
    public Page<SkillDTO> all(Pageable pageable) {
        return this.skillRepository.findAll(pageable)
                .map(this.skillMapper::fromSkill);
    }

    // Service pour récupérer toutes les compétences avec leurs catégories
    public List<SkillDTO> getAllSkills() {
        return this.skillRepository.findAll()
                .stream()
                .map(this.skillMapper::fromSkill)
                .toList();
    }


    @Override
    public SkillDTO add(SkillDTO e) {

        Skill skill = this.skillMapper.fromSkillDTO(e);

        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());
        Optional<SkillCategory> skillCategory = this.skillCategoryRepository.findById(e.getSkillCategory_id());

        if (account.isPresent() && skillCategory.isPresent())
        {
            skill.setRefSkill(this.uuidService.generateUuid());
            skill.setSkillCategory(skillCategory.get());
            skill.setAccount(account.get());

            return this.skillMapper.fromSkill(this.skillRepository.save(skill));
        }

        throw new RuntimeException("Unable to retrieve Account and Skill Category. Please check the provide IDS ");
    }

    @Override
    public SkillDTO update(Long id, SkillDTO e) {

        return this.skillMapper.fromSkill(this.skillRepository.findById(id)
                .map(skill -> {
/*                    if (skill.getRefSkill() == null)
                        skill.setRefSkill(this.uuidService.generateUuid());*/
                    if (skill.getName() != null)
                        skill.setName(e.getName());
                    if (skill.getDescription() != null)
                        skill.setDescription(e.getDescription());
                    Optional.ofNullable(skill.getLevelSkill()).ifPresent(skill::setLevelSkill);
                    if (skill.getSkillCategory() != null)
                    {
                        Optional<SkillCategory> skillCategory = this.skillCategoryRepository.findById(e.getSkillCategory_id());

                        skill.setSkillCategory(skillCategory.get());
                    }

                    if (skill.getAccount() != null)
                    {
                        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());
                         skill.setAccount(account.get());
                    }

                    return this.skillRepository.save(skill);
                })
                .orElseThrow(() -> new RuntimeException("Skill with ID : " +id+ " was not found")));
    }

    @Override
    public void remove(Long id) {

        Optional<Skill> skill = this.skillRepository.findById(id);

        if (skill.isEmpty())
            throw new RuntimeException("Unable to retrieve Skill. Please check the provide ID");

        this.skillRepository.delete(skill.get());

    }

    @Override
    public Optional<SkillDTO> getById(Long id) {
        return this.skillRepository.findById(id)
                .map(this.skillMapper::fromSkill);
    }

    public Page<SkillDTO> getSkillsByCategory(Long categoryId, Pageable pageable)
    {
        return this.skillRepository.findSkillsByCategoryId(categoryId, pageable)
                .map(this.skillMapper::fromSkill);
    }
}
