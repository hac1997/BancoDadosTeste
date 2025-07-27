package ads.bcd.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class JovemRequisitoEspecialidadeId implements Serializable {
    private Integer jovem;
    private Integer requisito;
}