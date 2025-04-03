package fr.kolgna_sec.portfolio_api.role.controller;

import fr.kolgna_sec.portfolio_api.role.dto.RoleDTO;
import fr.kolgna_sec.portfolio_api.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("role")
@Slf4j
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/all-role")
    public ResponseEntity<Page<RoleDTO>> allRole(Pageable pageable)
    {
        return ResponseEntity.ok(this.roleService.all(pageable));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/add-role")
    public ResponseEntity<RoleDTO> addRole(@Validated @RequestBody RoleDTO roleDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.add(roleDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("update-role/{idRole}")
    public ResponseEntity<RoleDTO> updateRole(@Validated @PathVariable Long idRole, @RequestBody RoleDTO roleDTO)
    {
        return ResponseEntity.status(202).body(this.roleService.update(idRole, roleDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("remove-role/{idRole}")
    public ResponseEntity<String> removeRole(@Validated @PathVariable Long idRole)
    {
        this.roleService.remove(idRole);
        return ResponseEntity.status(202).body("Role with ID : " +idRole+ " has been successfully remove");
    }

    @GetMapping("get-by-id-role/{idRole}")
    public ResponseEntity<RoleDTO> getByIdRole(@Validated @PathVariable Long idRole)
    {
        return this.roleService.getById(idRole)
                .map(roleDTO -> {
                    log.info("Role with ID :" +idRole+ " has been found");
                    return new ResponseEntity<>(roleDTO, HttpStatus.OK);
                })
                .orElseThrow(() ->{
                    log.error("Role with ID" +idRole+ "was not found");
                    return new RuntimeException("Unable to retrieve role. Please check the provide ID");
                });
    }
}
