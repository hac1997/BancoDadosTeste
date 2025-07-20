package ads.bcd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "insignia")
public class Insignia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInsignia;

    @Column(nullable = false, length = 100)
    private String nome;

    protected Insignia() {
    }

    public Insignia(String nome) {
        this.nome = nome;
    }

}