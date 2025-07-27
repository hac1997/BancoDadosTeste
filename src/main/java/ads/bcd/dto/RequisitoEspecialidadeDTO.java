package ads.bcd.dto;

import java.util.ArrayList;
import java.util.List;

public class RequisitoEspecialidadeDTO {
    private Integer idRequisito;
    private String requisito;
    private List<EspecialidadeDTO> especialidades = new ArrayList<>();

    public RequisitoEspecialidadeDTO() {}

    public Integer getIdRequisito() {
        return idRequisito;
    }

    public void setIdRequisito(Integer idRequisito) {
        this.idRequisito = idRequisito;
    }

    public String getRequisito() {
        return requisito;
    }

    public void setRequisito(String requisito) {
        this.requisito = requisito;
    }

    public List<EspecialidadeDTO> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(List<EspecialidadeDTO> especialidades) {
        this.especialidades = especialidades;
    }
}