package ads.bcd.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import ads.bcd.model.Atividade;

public interface AtividadeRepository extends CrudRepository<Atividade, Integer> {
    List<Atividade> findByTipo(String tipo);
    List<Atividade> findByDataAtividadeBetween(LocalDate inicio, LocalDate fim);
    List<Atividade> findByStatus(String status);
}