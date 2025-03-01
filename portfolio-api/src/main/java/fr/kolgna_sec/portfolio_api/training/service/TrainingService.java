package fr.kolgna_sec.portfolio_api.training.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.establishment.bean.Establishment;
import fr.kolgna_sec.portfolio_api.establishment.repositories.EstablishmentRepository;
import fr.kolgna_sec.portfolio_api.training.bean.Training;
import fr.kolgna_sec.portfolio_api.training.dto.TrainingDTO;
import fr.kolgna_sec.portfolio_api.training.mappers.TrainingMapper;
import fr.kolgna_sec.portfolio_api.training.repositories.TrainingRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrainingService implements Webservices<TrainingDTO> {

    private final TrainingRepository trainingRepository;

    private final TrainingMapper trainingMapper;

    private final UuidService uuidService;

    private final EstablishmentRepository establishmentRepository;

    private final AccountRepository accountRepository;

    @Override
    public Page<TrainingDTO> all(Pageable pageable) {
        return this.trainingRepository.findAll(pageable)
                .map(this.trainingMapper::fromTraining);
    }

    @Override
    public TrainingDTO add(TrainingDTO e) {

        Training training = this.trainingMapper.fromTrainingDTO(e);

        Optional<Establishment> establishment = this.establishmentRepository.findById(e.getEstablishment_id());
        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());

        if (establishment.isPresent() && account.isPresent())
        {
            training.setRefTraining(this.uuidService.generateUuid());
            training.setEstablishment(establishment.get());
            training.setAccount(account.get());

            return this.trainingMapper.fromTraining(
                    this.trainingRepository.save(training)
            );
        }
        else
            throw new RuntimeException("Unable to retrieve Establishment and Account. Please check provide ID");
    }

    @Override
    public TrainingDTO update(Long id, TrainingDTO e) {

        Optional<Account> account = this.accountRepository.findById(e.getAccount_id());
        Optional<Establishment> establishment = this.establishmentRepository.findById(e.getEstablishment_id());


        return this.trainingMapper.fromTraining(this.trainingRepository.findById(id)
                .map(training -> {
                    if (training.getIdTraining() == null)
                        training.setRefTraining(this.uuidService.generateUuid());
                    if (training.getLabel() != null)
                        training.setLabel(e.getLabel());
                    if (training.getDiploma() != null)
                        training.setDiploma(e.getDiploma());
                    if (training.getYearOfObtaining() != null)
                        training.setYearOfObtaining(e.getYearOfObtaining());

                    if (training.getEstablishment() != null)
                    {
                        training.setEstablishment(establishment.get());
                    }

                    if (training.getAccount() != null)
                        training.setAccount(account.get());

                    return this.trainingRepository.save(training);

                })
                .orElseThrow(() -> new RuntimeException("Unable to retrieve Training. Please check provide ID")));
    }

    @Override
    public void remove(Long id) {

        Optional<Training> training = this.trainingRepository.findById(id);

        if (training.isEmpty())
            throw new RuntimeException("Training with ID :" +id+ " was not found");

        this.trainingRepository.delete(training.get());

    }

    @Override
    public Optional<TrainingDTO> getById(Long id) {
        return this.trainingRepository.findById(id)
                .map(this.trainingMapper::fromTraining);
    }
}
