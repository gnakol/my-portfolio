package fr.kolgna_sec.portfolio_api.simulation.bean;

import fr.kolgna_sec.portfolio_api.skill.bean.Skill;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "simulation")
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_simulation")
    private Long idSimulation;

    @Column(name = "ref_simulation")
    private String refSimulation;

    @Column(name = "description")
    private String description;

    @Column(name = "command_test")
    private String commandTest;

    @Column(name = "expected_result")
    private String expectedResult;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "id_skill", nullable = false)
    private Skill skill;
}

