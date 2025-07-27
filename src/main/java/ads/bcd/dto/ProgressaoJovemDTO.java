package ads.bcd.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ProgressaoJovemDTO {
    private Integer idJovem;
    private String nomeJovem;
    private List<Map<String, Object>> progressaoEspecialidades; // Example field for progress data
    private Integer totalRequisitosCumpridos;
    private String nivelAtual;
    private String dataNasc;

    // Constructor, if needed
    public ProgressaoJovemDTO(Integer idJovem, String nomeJovem, List<Map<String, Object>> progressaoEspecialidades,
            Integer totalRequisitosCumpridos, String nivelAtual) {
        this.idJovem = idJovem;
        this.nomeJovem = nomeJovem;
        this.progressaoEspecialidades = progressaoEspecialidades;
        this.totalRequisitosCumpridos = totalRequisitosCumpridos;
        this.nivelAtual = nivelAtual;
    }

    // Default constructor for Jackson
    public ProgressaoJovemDTO() {
    }
}