package ads.bcd.service;

import ads.bcd.model.Insignia;
import ads.bcd.repository.InsigniaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class InsigniaService {

    @Autowired
    private InsigniaRepository insigniaRepository;

    public List<Insignia> listarTodas() {
        return StreamSupport.stream(insigniaRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<Insignia> buscarPorId(Integer id) {
        return insigniaRepository.findById(id);
    }

    public Insignia salvar(Insignia insignia) {
        return insigniaRepository.save(insignia);
    }

    public void deletar(Integer id) {
        insigniaRepository.deleteById(id);
    }
}