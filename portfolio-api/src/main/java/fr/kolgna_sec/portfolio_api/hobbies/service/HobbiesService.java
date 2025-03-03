package fr.kolgna_sec.portfolio_api.hobbies.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.hobbies.bean.Hobbies;
import fr.kolgna_sec.portfolio_api.hobbies.dto.HobbiesDTO;
import fr.kolgna_sec.portfolio_api.hobbies.mappers.HobbiesMapper;
import fr.kolgna_sec.portfolio_api.hobbies.repositories.HobbiesRepository;
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
public class HobbiesService implements Webservices<HobbiesDTO> {

    private final HobbiesRepository hobbiesRepository;

    private final HobbiesMapper hobbiesMapper;

    private final UuidService uuidService;

    private final AccountRepository accountRepository;

    @Override
    public Page<HobbiesDTO> all(Pageable pageable) {
        return this.hobbiesRepository.findAll(pageable)
                .map(this.hobbiesMapper::fromHobbies);
    }

    // Service pour récupérer tous les centres d'intérêt
    public List<HobbiesDTO> getAllHobbies() {
        return this.hobbiesRepository.findAll()
                .stream()
                .map(this.hobbiesMapper::fromHobbies)
                .toList();
    }


    @Override
    public HobbiesDTO add(HobbiesDTO e) {

        Hobbies hobbies = this.hobbiesMapper.fromHobbiesDTO(e);

        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());

        if (account.isPresent())
        {
            hobbies.setRefHobby(this.uuidService.generateUuid());
            hobbies.setAccount(account.get());

            return this.hobbiesMapper.fromHobbies(this.hobbiesRepository.save(hobbies));
        }

        throw new RuntimeException("Unable to retrieve Account. Please check the provide ID");
    }

    @Override
    public HobbiesDTO update(Long id, HobbiesDTO e) {
        return this.hobbiesMapper.fromHobbies(this.hobbiesRepository.findById(id)
                .map(hobbies -> {
                    if (hobbies.getRefHobby() == null)
                        hobbies.setRefHobby(e.getRefHobby());
                    if (hobbies.getName() != null)
                        hobbies.setName(e.getName());
                    if (hobbies.getDescription() != null)
                        hobbies.setDescription(e.getDescription());
                    if (hobbies.getAccount() != null)
                    {
                        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());

                        hobbies.setAccount(account.get());
                    }

                    return this.hobbiesRepository.save(hobbies);
                })
                .orElseThrow(() -> new RuntimeException("Hobbies with id : " +id+ " was not found")));
    }

    @Override
    public void remove(Long id) {

        Optional<Hobbies> hobbies = this.hobbiesRepository.findById(id);

        if (hobbies.isEmpty())
            throw new RuntimeException("Hobbies with ID : " +id+ " was not found");

        this.hobbiesRepository.delete(hobbies.get());

    }

    @Override
    public Optional<HobbiesDTO> getById(Long id) {
        return this.hobbiesRepository.findById(id)
                .map(this.hobbiesMapper::fromHobbies);
    }
}
