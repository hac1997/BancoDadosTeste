package ads.bcd.service;

import ads.bcd.model.Atividade;
import ads.bcd.repository.AtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    public List<Atividade> listarTodas() {
        return (List<Atividade>) atividadeRepository.findAll();
    }

    public Optional<Atividade> buscarPorId(Integer id) {
        return atividadeRepository.findById(id);
    }

    public Atividade salvar(Atividade atividade) {
        return atividadeRepository.save(atividade);
    }

    public void deletar(Integer id) {
        atividadeRepository.deleteById(id);
    }
}