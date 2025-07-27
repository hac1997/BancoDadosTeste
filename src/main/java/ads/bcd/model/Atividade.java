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
    private Integer idAtividade;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_atividade", nullable = false)
    private LocalDate dataAtividade;

    @Column(length = 100)
    private String tipo;

    @Column(length = 255)
    private String local;

    @Column(length = 100)
    private String responsavel;

    @Column(length = 50)
    private String status;

    protected Atividade() {}

    public Atividade(String descricao, LocalDate dataAtividade) {
        this.descricao = descricao;
        this.dataAtividade = dataAtividade;
    }

    // Método para compatibilidade com o controller
    public void setId_atividade(Integer id) {
        this.idAtividade = id;
    }

    public Integer getId_atividade() {
        return this.idAtividade;
    }
}