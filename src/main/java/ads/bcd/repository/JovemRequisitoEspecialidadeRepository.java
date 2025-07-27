package ads.bcd.repository;

import ads.bcd.model.JovemRequisitoEspecialidade;
import ads.bcd.model.JovemRequisitoEspecialidadeId;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface JovemRequisitoEspecialidadeRepository extends CrudRepository<JovemRequisitoEspecialidade, JovemRequisitoEspecialidadeId> {

    List<JovemRequisitoEspecialidade> findByJovemIdJovem(Integer idJovem);
}