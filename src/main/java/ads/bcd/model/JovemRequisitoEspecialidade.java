package ads.bcd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "jovem_requisito_especialidade")
@IdClass(JovemRequisitoEspecialidadeId.class)
public class JovemRequisitoEspecialidade {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_jovem")
    private Jovem jovem;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_requisito")
    private RequisitoEspecialidade requisito;

    @Column(name = "data_cumprimento", nullable = false)
    private LocalDate data_cumprimento;

    public JovemRequisitoEspecialidade() {}

    public JovemRequisitoEspecialidade(Jovem jovem, RequisitoEspecialidade requisito, LocalDate dataCumprimento) {
        this.jovem = jovem;
        this.requisito = requisito;
        this.data_cumprimento = dataCumprimento;
    }
}