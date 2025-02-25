package fr.kolgna_sec.portfolio_api.hobbies.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
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
@Table(name = "hobbies")
public class Hobbies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hobby")
    private Long idHobbies;

    @Column(name = "ref_hobby")
    private String refHobby;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"hobbies", "experiences", "skills", "trainings"})
    @JoinColumn(name = "id_account", nullable = true)
    private Account account;
}
