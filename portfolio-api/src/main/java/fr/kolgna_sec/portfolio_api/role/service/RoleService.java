package fr.kolgna_sec.portfolio_api.role.service;

import fr.kolgna_sec.portfolio_api.role.bean.Role;
import fr.kolgna_sec.portfolio_api.role.dto.RoleDTO;
import fr.kolgna_sec.portfolio_api.role.mappers.RoleMapper;
import fr.kolgna_sec.portfolio_api.role.repositories.RoleRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements Webservices<RoleDTO> {

    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    private final UuidService uuidService;

    @Override
    public Page<RoleDTO> all(Pageable pageable) {
        return this.roleRepository.findAll(pageable).map(this.roleMapper::fromRole);
    }

    @Override
    public RoleDTO add(RoleDTO e) {
        e.setRefRole(this.uuidService.generateUuid());
        return this.roleMapper.fromRole(this.roleRepository.save(this.roleMapper.fromRoleDTO(e)));
    }

    @Override
    public RoleDTO update(Long id, RoleDTO e) {
        return this.roleMapper.fromRole(this.roleRepository.findById(id)
                .map(role -> {
                    if (role.getRefRole() == null)
                        role.setRefRole(this.uuidService.generateUuid());
                    if (role.getName() != null)
                        role.setName(e.getName());
                    return this.roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Sorry role id with not found")));
    }

    @Override
    public void remove(Long id) {

        Optional<Role> role = this.roleRepository.findById(id);

        if (role.isPresent())
            this.roleRepository.delete(role.get());

    }

    @Override
    public Optional<RoleDTO> getById(Long id) {
        return this.roleRepository.findById(id).map(this.roleMapper::fromRole);
    }

    public List<RoleDTO> getDefaultRoles()
    {
        Role role = this.roleRepository.findByName("VISITOR")
                .orElseThrow(() -> new IllegalStateException("Default role 'customer' is not defined in database "));

        RoleDTO roleDTO = this.roleMapper.fromRole(role);
        return Collections.singletonList(roleDTO);
    }
}
