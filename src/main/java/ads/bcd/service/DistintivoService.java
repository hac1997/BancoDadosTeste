package ads.bcd.service;

import ads.bcd.model.DistintivosDeProgressao;
import ads.bcd.model.Jovem;
import ads.bcd.repository.DistintivosDeProgressaoRepository;
import ads.bcd.repository.JovemRepository;
import ads.bcd.repository.JovemRequisitoEspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DistintivoService {

    @Autowired
    private DistintivosDeProgressaoRepository distintivoRepository;

    @Autowired
    private JovemRepository jovemRepository;

    @Autowired
    private JovemRequisitoEspecialidadeRepository jovemRequisitoRepository;

    public List<DistintivosDeProgressao> listarTodos() {
        return StreamSupport.stream(distintivoRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<DistintivosDeProgressao> buscarPorId(Integer id) {
        return distintivoRepository.findById(id);
    }

    public DistintivosDeProgressao salvar(DistintivosDeProgressao distintivo) {
        return distintivoRepository.save(distintivo);
    }

    public void deletar(Integer id) {
        distintivoRepository.deleteById(id);
    }

    public List<Map<String, Object>> obterJovensComDistintivos() {
        List<Jovem> jovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (Jovem jovem : jovens) {
            Map<String, Object> jovemInfo = new HashMap<>();
            jovemInfo.put("id", jovem.getIdJovem());
            jovemInfo.put("nome", jovem.getNome());
            
            // Calcular distintivos baseado no número de requisitos cumpridos
            long totalRequisitos = jovemRequisitoRepository.findByJovemIdJovem(jovem.getIdJovem()).size();
            List<String> distintivos = new ArrayList<>();
            List<Integer> distintivoIds = new ArrayList<>();
            
            if (totalRequisitos >= 4) {
                distintivos.add("Lobo Pata Tenra");
                distintivoIds.add(1);
            }
            if (totalRequisitos >= 6) {
                distintivos.add("Lobo Saltador");
                distintivoIds.add(2);
            }
            if (totalRequisitos >= 8) {
                distintivos.add("Lobo Rastreador");
                distintivoIds.add(3);
            }
            if (totalRequisitos >= 10) {
                distintivos.add("Lobo Caçador");
                distintivoIds.add(4);
            }
            if (totalRequisitos >= 15) {
                distintivos.add("Cruzeiro do Sul");
                distintivoIds.add(5);
            }
            
            jovemInfo.put("distintivos", distintivoIds);
            jovemInfo.put("insignias", Arrays.asList(1)); // Mock data
            jovemInfo.put("progresso", Math.min(100, (int) (totalRequisitos * 6.67))); // Aproximação
            
            String proximoDistintivo = "Lobo Pata Tenra";
            if (totalRequisitos >= 10) proximoDistintivo = "Cruzeiro do Sul";
            else if (totalRequisitos >= 8) proximoDistintivo = "Lobo Caçador";
            else if (totalRequisitos >= 6) proximoDistintivo = "Lobo Rastreador";
            else if (totalRequisitos >= 4) proximoDistintivo = "Lobo Saltador";
            
            jovemInfo.put("proximoDistintivo", proximoDistintivo);
            
            resultado.add(jovemInfo);
        }
        
        return resultado;
    }
}