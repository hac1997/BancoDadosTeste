package ads.bcd.repository;

import ads.bcd.model.RequisitoEspecialidade;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RequisitoEspecialidadeRepository extends CrudRepository<RequisitoEspecialidade, Integer> {

    @Query("SELECT re FROM RequisitoEspecialidade re JOIN re.especialidades esp WHERE esp.idEspecialidade = :idEspecialidade")
    List<RequisitoEspecialidade> findByEspecialidadeIdEspecialidade(Integer idEspecialidade);
}