package ads.bcd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "atividade")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_atividade;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "data_atividade", nullable = false)
    private LocalDate data_atividade;

    protected Atividade() {}

    public Atividade(String descripcion, LocalDate dataAtividade) {
        this.descripcion = descripcion;
        this.data_atividade = dataAtividade;
    }
}