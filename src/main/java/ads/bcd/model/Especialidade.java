package ads.bcd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "especialidade")
public class Especialidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEspecialidade;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Integer nivel;

    @Column(nullable = false)
    private Integer totalRequisitos;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_area_conhecimento")
    private AreaConhecimento areaConhecimento;

    @ManyToMany
    @JoinTable(
        name = "e_requisito_especialidade",
        joinColumns = @JoinColumn(name = "id_especialidade"),
        inverseJoinColumns = @JoinColumn(name = "id_requisito")
    )
    private List<RequisitoEspecialidade> requisitos = new ArrayList<>();

    public Especialidade() {}

    public Especialidade(String descricao, Integer nivel, Integer totalRequisitos, AreaConhecimento areaConhecimento) {
        this.descricao = descricao;
        this.nivel = nivel;
        this.totalRequisitos = totalRequisitos;
        this.areaConhecimento = areaConhecimento;
    }
}