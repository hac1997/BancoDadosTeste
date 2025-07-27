package ads.bcd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "requisito_especialidade")
public class RequisitoEspecialidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRequisito;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requisito;

    @ManyToMany(mappedBy = "requisitos")
    private List<Especialidade> especialidades = new ArrayList<>();

    public RequisitoEspecialidade() {}

    public RequisitoEspecialidade(String requisito) {
        this.requisito = requisito;
    }
}