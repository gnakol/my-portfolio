package fr.kolgna_sec.portfolio_api.establishment.service;

import fr.kolgna_sec.portfolio_api.establishment.bean.Establishment;
import fr.kolgna_sec.portfolio_api.establishment.dto.EstablishmentDTO;
import fr.kolgna_sec.portfolio_api.establishment.mappers.EstablishmentMapper;
import fr.kolgna_sec.portfolio_api.establishment.repositories.EstablishmentRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EstablishmentService implements Webservices<EstablishmentDTO> {

    private final EstablishmentRepository establishmentRepository;

    private final EstablishmentMapper establishmentMapper;

    private final UuidService uuidService;

    @Override
    public Page<EstablishmentDTO> all(Pageable pageable) {
        return this.establishmentRepository.findAll(pageable).map(this.establishmentMapper::fromEstablishment);
    }

    @Override
    public EstablishmentDTO add(EstablishmentDTO e) {
        e.setRefEstablishment(this.uuidService.generateUuid());
        return this.establishmentMapper.fromEstablishment(this.establishmentRepository.save(this.establishmentMapper.fromEstablishmentDTO(e)));
    }

    @Override
    public EstablishmentDTO update(Long id, EstablishmentDTO e) {
        return this.establishmentRepository.findById(id)
                .map(existingEstablishment -> {
                    Optional.ofNullable(e.getName()).ifPresent(existingEstablishment::setName);
                    Optional.ofNullable(e.getCity()).ifPresent(existingEstablishment::setCity);

                    return this.establishmentMapper.fromEstablishment(this.establishmentRepository.save(existingEstablishment));
                })
                .orElseThrow(() -> new RuntimeException("Establishment with ID : " +id+ " was not found"));
    }

    @Override
    public void remove(Long id) {

        Optional<Establishment> establishment = this.establishmentRepository.findById(id);

        if (establishment.isEmpty())
            throw  new RuntimeException("Unable to retrieve Establishment. Please check the provide ID");

        this.establishmentRepository.delete(establishment.get());

    }

    @Override
    public Optional<EstablishmentDTO> getById(Long id) {
        return this.establishmentRepository.findById(id)
                .map(this.establishmentMapper::fromEstablishment);
    }
}
