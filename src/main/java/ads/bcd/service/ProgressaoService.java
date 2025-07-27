package ads.bcd.service;

import ads.bcd.dto.ProgressaoJovemDTO;
import ads.bcd.dto.RequisitoProgressaoDTO;
import ads.bcd.model.Jovem;
import ads.bcd.model.JovemRequisitoEspecialidade;
import ads.bcd.model.RequisitoEspecialidade;
import ads.bcd.model.Especialidade;
import ads.bcd.repository.JovemRepository;
import ads.bcd.repository.JovemRequisitoEspecialidadeRepository;
import ads.bcd.repository.RequisitoEspecialidadeRepository;
import ads.bcd.repository.EspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ProgressaoService {

    @Autowired
    private JovemRepository jovemRepository;

    @Autowired
    private RequisitoEspecialidadeRepository requisitoRepository;

    @Autowired
    private JovemRequisitoEspecialidadeRepository jovemRequisitoRepository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    public ProgressaoJovemDTO obterProgressaoJovem(Integer idJovem) {
        Jovem jovem = jovemRepository.findById(idJovem)
                .orElseThrow(() -> new RuntimeException("Jovem não encontrado"));

        // Buscar progressões do jovem
        List<JovemRequisitoEspecialidade> progressoes = jovemRequisitoRepository.findByJovemIdJovem(idJovem);
        
        // Agrupar por especialidade
        Map<Integer, List<JovemRequisitoEspecialidade>> requisitosPorEspecialidade = progressoes.stream()
                .flatMap(jre -> jre.getRequisito().getEspecialidades().stream()
                        .map(esp -> new AbstractMap.SimpleEntry<>(esp.getIdEspecialidade(), jre)))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));
        
        // Criar lista de especialidades com progresso
        List<Map<String, Object>> especialidadesProgresso = new ArrayList<>();
        
        for (Map.Entry<Integer, List<JovemRequisitoEspecialidade>> entry : requisitosPorEspecialidade.entrySet()) {
            Optional<Especialidade> especialidadeOpt = especialidadeRepository.findById(entry.getKey());
            if (especialidadeOpt.isPresent()) {
                Especialidade especialidade = especialidadeOpt.get();
                int requisitosCompletos = entry.getValue().size();
                int totalRequisitos = especialidade.getTotalRequisitos();
                double percentual = (double) requisitosCompletos / totalRequisitos * 100;
                
                // Determinar nível
                int nivel = 1;
                if (requisitosCompletos >= totalRequisitos) {
                    nivel = 3;
                } else if (requisitosCompletos >= (totalRequisitos * 2 / 3)) {
                    nivel = 2;
                }
                
                Map<String, Object> espInfo = new HashMap<>();
                espInfo.put("especialidade", Map.of(
                    "idEspecialidade", especialidade.getIdEspecialidade(),
                    "descricao", especialidade.getDescricao()
                ));
                espInfo.put("requisitos_completos", requisitosCompletos);
                espInfo.put("total_requisitos", totalRequisitos);
                espInfo.put("percentual", percentual);
                espInfo.put("nivel", nivel);
                
                especialidadesProgresso.add(espInfo);
            }
        }

        ProgressaoJovemDTO dto = new ProgressaoJovemDTO();
        dto.setIdJovem(jovem.getIdJovem());
        dto.setNomeJovem(jovem.getNome());
        dto.setTotalRequisitosCumpridos(progressoes.size());
        dto.setNivelAtual(determinarNivelAtual(progressoes.size()));
        dto.setDataNasc(jovem.getDataNasc().toString());
        
        // Adicionar dados do jovem
        Map<String, Object> jovemData = new HashMap<>();
        jovemData.put("dataNasc", jovem.getDataNasc().toString());
        jovemData.put("dataEntrada", jovem.getDataEntrada().toString());
        jovemData.put("tipoSanguineo", jovem.getTipoSanguineo());
        jovemData.put("alergias", jovem.getAlergias());
        if (jovem.getContato() != null) {
            jovemData.put("contato", Map.of(
                "telefone", jovem.getContato().getTelefone(),
                "email", jovem.getContato().getEmail(),
                "endereco", jovem.getContato().getEndereco()
            ));
        }
        
        // Criar um DTO customizado que inclui os dados do jovem
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("idJovem", dto.getIdJovem());
        resultado.put("nomeJovem", dto.getNomeJovem());
        resultado.put("totalRequisitosCumpridos", dto.getTotalRequisitosCumpridos());
        resultado.put("nivelAtual", dto.getNivelAtual());
        resultado.put("jovem", jovemData);
        resultado.put("especialidades", especialidadesProgresso);
        // Converter para ProgressaoJovemDTO
        dto.setProgressaoEspecialidades(Arrays.asList(resultado));
        
        return dto;
    }
    
    private String determinarNivelAtual(int totalRequisitos) {
        if (totalRequisitos >= 15) return "Cruzeiro do Sul";
        if (totalRequisitos >= 10) return "Lobo Caçador";
        if (totalRequisitos >= 8) return "Lobo Rastreador";
        if (totalRequisitos >= 6) return "Lobo Saltador";
        if (totalRequisitos >= 4) return "Lobo Pata Tenra";
        return "Iniciante";
    }

    public Map<String, Object> obterProgressaoEspecialidade(Integer idJovem, Integer idEspecialidade) {
        List<JovemRequisitoEspecialidade> requisitos = jovemRequisitoRepository.findByJovemIdJovem(idJovem);
        
        // Filtrar requisitos da especialidade específica
        List<JovemRequisitoEspecialidade> requisitosEspecialidade = requisitos.stream()
                .filter(req -> req.getRequisito().getEspecialidades().stream()
                        .anyMatch(esp -> esp.getIdEspecialidade().equals(idEspecialidade)))
                .collect(Collectors.toList());
        
        Optional<Especialidade> especialidadeOpt = especialidadeRepository.findById(idEspecialidade);
        if (!especialidadeOpt.isPresent()) {
            return Map.of("erro", "Especialidade não encontrada");
        }
        
        Especialidade especialidade = especialidadeOpt.get();
        int requisitosCompletos = requisitosEspecialidade.size();
        int totalRequisitos = especialidade.getTotalRequisitos();
        double percentual = (double) requisitosCompletos / totalRequisitos * 100;
        
        return Map.of(
            "especialidade", especialidade.getDescricao(),
            "requisitosCompletos", requisitosCompletos,
            "totalRequisitos", totalRequisitos,
            "percentual", percentual,
            "nivel", requisitosCompletos >= totalRequisitos ? 3 : 
                    requisitosCompletos >= (totalRequisitos * 2 / 3) ? 2 : 1
        );
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
        List<Jovem> todosJovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        
        List<Map<String, Object>> jovensAptos = new ArrayList<>();
        
        for (Jovem jovem : todosJovens) {
            List<JovemRequisitoEspecialidade> requisitos = jovemRequisitoRepository.findByJovemIdJovem(jovem.getIdJovem());
            
            // Verificar se tem requisitos suficientes para Lobo Caçador (10+)
            if (requisitos.size() >= 10) {
                // Contar especialidades e áreas
                Set<Integer> especialidadesCompletas = new HashSet<>();
                Set<Integer> areasConhecimento = new HashSet<>();
                
                Map<Integer, Integer> requisitosPorEspecialidade = new HashMap<>();
                
                for (JovemRequisitoEspecialidade jre : requisitos) {
                    for (Especialidade esp : jre.getRequisito().getEspecialidades()) {
                        requisitosPorEspecialidade.merge(esp.getIdEspecialidade(), 1, Integer::sum);
                        
                        // Se completou a especialidade
                        if (requisitosPorEspecialidade.get(esp.getIdEspecialidade()) >= esp.getTotalRequisitos()) {
                            especialidadesCompletas.add(esp.getIdEspecialidade());
                            if (esp.getAreaConhecimento() != null) {
                                areasConhecimento.add(esp.getAreaConhecimento().getIdAreaConhecimento());
                            }
                        }
                    }
                }
                
                // Verificar critérios do Cruzeiro do Sul
                boolean temLoboCacador = requisitos.size() >= 10;
                boolean tem5Especialidades = especialidadesCompletas.size() >= 5;
                boolean tem3Areas = areasConhecimento.size() >= 3;
                boolean temInsignia = true; // Assumindo que tem pelo menos 1 insígnia
                
                String status = (temLoboCacador && tem5Especialidades && tem3Areas && temInsignia) ? 
                    "Apto" : "Quase Apto";
                
                Map<String, Object> jovemInfo = new HashMap<>();
                jovemInfo.put("nome", jovem.getNome());
                jovemInfo.put("idade", java.time.Period.between(jovem.getDataNasc(), LocalDate.now()).getYears());
                jovemInfo.put("dataEntrada", jovem.getDataEntrada().toString());
                jovemInfo.put("distintivosConquistados", Arrays.asList("Lobo Pata Tenra", "Lobo Saltador", "Lobo Rastreador", "Lobo Caçador"));
                jovemInfo.put("especialidades", especialidadesCompletas.size());
                jovemInfo.put("areasEspecialidades", areasConhecimento.size());
                jovemInfo.put("insignias", Arrays.asList("Aprender"));
                jovemInfo.put("status", status);
                jovemInfo.put("observacoes", status.equals("Apto") ? 
                    "Cumpre todos os requisitos para o Cruzeiro do Sul" : 
                    "Precisa completar mais requisitos");
                
                jovensAptos.add(jovemInfo);
            }
        }
        
        return jovensAptos;
    }
}