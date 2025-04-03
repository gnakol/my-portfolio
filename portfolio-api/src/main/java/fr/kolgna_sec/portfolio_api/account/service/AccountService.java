package fr.kolgna_sec.portfolio_api.account.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.role.bean.Role;
import fr.kolgna_sec.portfolio_api.role.mappers.RoleMapper;
import fr.kolgna_sec.portfolio_api.role.repositories.RoleRepository;
import fr.kolgna_sec.portfolio_api.role.service.RoleService;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService implements Webservices<AccountDTO>, UserDetailsService {

    private final AccountRepository accountRepository;

    private final AccountMapper accountMapper;

    private final UuidService uuidService;

    private final BCryptPasswordEncoder passwordEncoder;

    private final RoleService roleService;

    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    @Override
    public Page<AccountDTO> all(Pageable pageable) {
        return this.accountRepository.findAll(pageable).map(this.accountMapper::fromAccount);
    }

    @Override
    public AccountDTO add(AccountDTO e) {

        Account account = this.accountMapper.fromAccountDTO(e);

        List<Role> roles = e.getRoleDTOS().stream()
                        .map(this.roleMapper::fromRoleDTO)
                                .collect(Collectors.toList());

        account.setRoles(roles);
        account.setRefAccount(this.uuidService.generateUuid());
        account.setPassword(this.passwordEncoder.encode(e.getPassword()));

        return this.accountMapper.fromAccount(this.accountRepository.save(account));
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
                    if (e.getEmail() != null)
                        account.setEmail(e.getEmail());
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
                    if (e.getRoleDTOS() != null || !e.getRoleDTOS().isEmpty())
                    {
                        List<Role> roles = e.getRoleDTOS().stream()
                                .map(this.roleMapper::fromRoleDTO)
                                .collect(Collectors.toList());
                        account.setRoles(roles);
                    }

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

    public void changePassword(String username, String oldPassword, String newPassword)
    {
        Account account = this.accountRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!this.passwordEncoder.matches(oldPassword, account.getPassword()))
        {
            throw new RuntimeException("Old password does not match.");
        }

        account.setPassword(this.passwordEncoder.encode(newPassword));
        this.accountRepository.save(account);
    }
}
