package ads.bcd.service;

import ads.bcd.dto.ProgressaoJovemDTO;
import ads.bcd.dto.RequisitoProgressaoDTO;
import ads.bcd.model.Jovem;
import ads.bcd.model.JovemRequisitoEspecialidade;
import ads.bcd.model.RequisitoEspecialidade;
import ads.bcd.repository.JovemRepository;
import ads.bcd.repository.JovemRequisitoEspecialidadeRepository;
import ads.bcd.repository.RequisitoEspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProgressaoService {

    @Autowired
    private JovemRepository jovemRepository;

    @Autowired
    private RequisitoEspecialidadeRepository requisitoRepository;

    @Autowired
    private JovemRequisitoEspecialidadeRepository jovemRequisitoRepository;

    public ProgressaoJovemDTO obterProgressaoJovem(Integer idJovem) {
        Jovem jovem = jovemRepository.findById(idJovem)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        // Fetch progress data (example logic)
        List<JovemRequisitoEspecialidade> progressoes = jovemRequisitoRepository.findByJovemIdJovem(idJovem);
        List<Map<String, Object>> progressaoEspecialidades = progressoes.stream()
                .map(jre -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("idRequisito", jre.getRequisito().getIdRequisito());
                    map.put("nomeRequisito", jre.getRequisito().getRequisito());
                    map.put("dataCumprimento", jre.getData_cumprimento());
                    return map;
                })
                .collect(Collectors.toList());

        return new ProgressaoJovemDTO(
                jovem.getIdJovem(),
                jovem.getNome(),
                progressaoEspecialidades,
                progressaoEspecialidades.size(),
                "Nível Exemplo" // Replace with actual logic
        );
    }

    public Map<String, Object> obterProgressaoEspecialidade(Integer idJovem, Integer idEspecialidade) {
        // Implement logic to fetch specialty progress
        return Map.of();
    }

    public JovemRequisitoEspecialidade registrarRequisito(RequisitoProgressaoDTO dto) {
        Jovem jovem = jovemRepository.findById(dto.getIdJovem())
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));
        RequisitoEspecialidade requisito = requisitoRepository.findById(dto.getIdRequisito())
                .orElseThrow(() -> new RuntimeException("Requisito não encontrado"));

        JovemRequisitoEspecialidade jre = new JovemRequisitoEspecialidade();
        jre.setJovem(jovem);
        jre.setRequisito(requisito);
        jre.setData_cumprimento(LocalDate.now());

        return jovemRequisitoRepository.save(jre);
    }

    public List<Map<String, Object>> jovensAptosCruzeiroDoSul() {
        // Implement logic for Cruzeiro do Sul eligibility
        return List.of();
    }
}