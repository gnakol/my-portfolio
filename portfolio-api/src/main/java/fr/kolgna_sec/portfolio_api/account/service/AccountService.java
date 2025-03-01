package fr.kolgna_sec.portfolio_api.account.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService implements Webservices<AccountDTO>, UserDetailsService {

    private final AccountRepository accountRepository;

    private final AccountMapper accountMapper;

    private final UuidService uuidService;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Page<AccountDTO> all(Pageable pageable) {
        return this.accountRepository.findAll(pageable).map(this.accountMapper::fromAccount);
    }

    @Override
    public AccountDTO add(AccountDTO e) {

        e.setRefAccount(this.uuidService.generateUuid());
        e.setPassword(this.passwordEncoder.encode(e.getPassword()));

        return this.accountMapper.fromAccount(this.accountRepository.save(this.accountMapper.fromAccountDTO(e)));
    }

    @Override
    public AccountDTO update(Long id, AccountDTO e) {
        return this.accountMapper.fromAccount(this.accountRepository.findById(id)
                .map(account -> {
                    if (account.getRefAccount() == null)
                        account.setRefAccount(e.getRefAccount());
                    if (account.getName() != null)
                        account.setName(e.getName());
                    if (account.getFirstName() != null)
                        account.setFirstName(e.getFirstName());
                    if (account.getEmail() != null)
                        account.setEmail(e.getEmail());
                    if (account.getPassword() != null)
                        account.setPassword(e.getPassword());
                    if (account.getPhoneNumber() != null)
                        account.setPhoneNumber(e.getPhoneNumber());
                    if (account.getCivility() != null)
                        account.setCivility(e.getCivility());
                    if (account.getGithub() != null)
                        account.setGithub(e.getGithub());
                    if (account.getLinkedin() != null)
                        account.setCivility(e.getCivility());
                    if (account.getAddress() != null)
                        account.setAddress(e.getAddress());

                    return this.accountRepository.save(account);
                })
                .orElseThrow(() -> new RuntimeException("Unable to retrieve Role. Please check the provide ID")));
    }

    @Override
    public void remove(Long id) {

        Optional<Account> accountDTO = this.accountRepository.findById(id);

        if (accountDTO.isEmpty())
            throw new RuntimeException("Unable to retrieve Role. Please check the provide ID");

        this.accountRepository.delete(accountDTO.get());

    }

    @Override
    public Optional<AccountDTO> getById(Long id) {
        return this.accountRepository.findById(id)
                .map(this.accountMapper::fromAccount);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.accountRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Long getAccountIdByEmail(String email)
    {
        Account account = this.accountRepository.findByEmail(email).get();

        return account.getIdAccount();
    }
}
