package ads.bcd.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import ads.bcd.model.*;
import ads.bcd.repository.*;

@Service
public class RelatorioService {

    // Constantes para evitar duplicação de strings
    private static final String INICIANTES = "iniciantes";
    private static final String INTERMEDIARIOS = "intermediarios";
    private static final String AVANCADOS = "avancados";
    private static final String ESPECIALISTAS = "especialistas";
    private static final String TOTAL_REQUISITOS = "totalRequisitos";
    private static final String DATA_ENTRADA = "dataEntrada";
    private static final String JOVENS_PARTICIPANTES = "jovensParticipantes";
    private static final String PERCENTUAL_COMPLETO = "percentualCompleto";
    private static final String PONTUACAO = "pontuacao";

    private final JovemRepository jovemRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final AreaConhecimentoRepository areaConhecimentoRepository;
    private final JovemRequisitoEspecialidadeRepository jovemRequisitoEspecialidadeRepository;

    public RelatorioService(JovemRepository jovemRepository,
            EspecialidadeRepository especialidadeRepository,
            AreaConhecimentoRepository areaConhecimentoRepository,
            JovemRequisitoEspecialidadeRepository jovemRequisitoEspecialidadeRepository) {
        this.jovemRepository = jovemRepository;
        this.especialidadeRepository = especialidadeRepository;
        this.areaConhecimentoRepository = areaConhecimentoRepository;
        this.jovemRequisitoEspecialidadeRepository = jovemRequisitoEspecialidadeRepository;
    }

    public Map<String, Object> obterEstatisticasGerais() {
        Map<String, Object> estatisticas = new HashMap<>();
        List<Jovem> todosJovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .toList();
        List<Especialidade> todasEspecialidades = StreamSupport
                .stream(especialidadeRepository.findAll().spliterator(), false)
                .toList();
        List<JovemRequisitoEspecialidade> todosRequisitos = StreamSupport
                .stream(jovemRequisitoEspecialidadeRepository.findAll().spliterator(), false)
                .toList();

        estatisticas.put("totalJovens", todosJovens.size());
        estatisticas.put("totalEspecialidades", todasEspecialidades.size());
        estatisticas.put("totalRequisitosCompletos", todosRequisitos.size());

        // Jovens aptos ao Cruzeiro do Sul (15+ requisitos)
        long jovensAptosCruzeiro = todosJovens.stream()
                .mapToLong(jovem -> jovemRequisitoEspecialidadeRepository.findByJovemIdJovem(jovem.getIdJovem()).size())
                .filter(count -> count >= 15)
                .count();
        estatisticas.put("jovensAptosCruzeiro", jovensAptosCruzeiro);

        // Média de idade dos jovens
        double mediaIdade = todosJovens.stream()
                .mapToLong(jovem -> ChronoUnit.YEARS.between(jovem.getDataNasc(), LocalDate.now()))
                .average()
                .orElse(0.0);
        estatisticas.put("mediaIdade", Math.round(mediaIdade * 10.0) / 10.0);

        // Distribuição por tipo sanguíneo
        Map<String, Long> distribuicaoTipoSanguineo = todosJovens.stream()
                .collect(Collectors.groupingBy(Jovem::getTipoSanguineo, Collectors.counting()));
        estatisticas.put("distribuicaoTipoSanguineo", distribuicaoTipoSanguineo);

        // Média de requisitos por jovem
        double mediaRequisitos = todosJovens.isEmpty() ? 0.0 : (double) todosRequisitos.size() / todosJovens.size();
        estatisticas.put("mediaRequisitosPorJovem", Math.round(mediaRequisitos * 10.0) / 10.0);

        return estatisticas;
    }

    public Map<String, Object> obterJovensPorNivel() {
        Map<String, Object> relatorio = new HashMap<>();
        List<Jovem> todosJovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .toList();

        Map<String, List<Map<String, Object>>> jovensClassificados = new HashMap<>();
        jovensClassificados.put(INICIANTES, new ArrayList<>());
        jovensClassificados.put(INTERMEDIARIOS, new ArrayList<>());
        jovensClassificados.put(AVANCADOS, new ArrayList<>());
        jovensClassificados.put(ESPECIALISTAS, new ArrayList<>());

        for (Jovem jovem : todosJovens) {
            long totalRequisitos = jovemRequisitoEspecialidadeRepository.findByJovemIdJovem(jovem.getIdJovem()).size();

            Map<String, Object> jovemInfo = new HashMap<>();
            jovemInfo.put("nome", jovem.getNome());
            jovemInfo.put(TOTAL_REQUISITOS, totalRequisitos);
            jovemInfo.put(DATA_ENTRADA, jovem.getDataEntrada());

            if (totalRequisitos >= 20) {
                jovensClassificados.get(ESPECIALISTAS).add(jovemInfo);
            } else if (totalRequisitos >= 15) {
                jovensClassificados.get(AVANCADOS).add(jovemInfo);
            } else if (totalRequisitos >= 8) {
                jovensClassificados.get(INTERMEDIARIOS).add(jovemInfo);
            } else {
                jovensClassificados.get(INICIANTES).add(jovemInfo);
            }
        }

        relatorio.put("classificacao", jovensClassificados);
        relatorio.put("contadores", Map.of(
                INICIANTES, jovensClassificados.get(INICIANTES).size(),
                INTERMEDIARIOS, jovensClassificados.get(INTERMEDIARIOS).size(),
                AVANCADOS, jovensClassificados.get(AVANCADOS).size(),
                ESPECIALISTAS, jovensClassificados.get(ESPECIALISTAS).size()));

        return relatorio;
    }

    public List<Map<String, Object>> obterEspecialidadesMaisPopulares() {
        List<Especialidade> todasEspecialidades = StreamSupport
                .stream(especialidadeRepository.findAll().spliterator(), false)
                .toList();
        List<JovemRequisitoEspecialidade> todosRequisitos = StreamSupport
                .stream(jovemRequisitoEspecialidadeRepository.findAll().spliterator(), false)
                .toList();
        List<Map<String, Object>> ranking = new ArrayList<>();

        for (Especialidade esp : todasEspecialidades) {
            Set<Integer> jovensUnicos = todosRequisitos.stream()
                    .filter(req -> req.getRequisito().getEspecialidades().stream()
                            .anyMatch(e -> e.getIdEspecialidade().equals(esp.getIdEspecialidade())))
                    .map(req -> req.getJovem().getIdJovem())
                    .collect(Collectors.toSet());

            Map<String, Object> item = new HashMap<>();
            item.put("especialidade", esp.getDescricao());
            item.put("nivel", esp.getNivel());
            item.put("areaConhecimento", esp.getAreaConhecimento().getNome());
            item.put(JOVENS_PARTICIPANTES, (long) jovensUnicos.size());
            item.put(TOTAL_REQUISITOS, esp.getTotalRequisitos());

            ranking.add(item);
        }

        ranking.sort((a, b) -> Long.compare((Long) b.get(JOVENS_PARTICIPANTES), (Long) a.get(JOVENS_PARTICIPANTES)));

        return ranking;
    }

    public List<Map<String, Object>> obterProgressaoPorArea() {
        List<AreaConhecimento> todasAreas = StreamSupport
                .stream(areaConhecimentoRepository.findAll().spliterator(), false)
                .toList();
        List<Especialidade> todasEspecialidades = StreamSupport
                .stream(especialidadeRepository.findAll().spliterator(), false)
                .toList();
        List<JovemRequisitoEspecialidade> todosRequisitos = StreamSupport
                .stream(jovemRequisitoEspecialidadeRepository.findAll().spliterator(), false)
                .toList();
        List<Map<String, Object>> progressao = new ArrayList<>();

        for (AreaConhecimento area : todasAreas) {
            List<Especialidade> especialidadesArea = todasEspecialidades.stream()
                    .filter(esp -> esp.getAreaConhecimento().getIdAreaConhecimento()
                            .equals(area.getIdAreaConhecimento()))
                    .toList();

            long totalRequisitosArea = especialidadesArea.stream()
                    .mapToLong(Especialidade::getTotalRequisitos)
                    .sum();

            long requisitosCompletosArea = todosRequisitos.stream()
                    .filter(req -> req.getRequisito().getEspecialidades().stream()
                            .anyMatch(esp -> esp.getAreaConhecimento().getIdAreaConhecimento()
                                    .equals(area.getIdAreaConhecimento())))
                    .count();

            double percentualCompleto = totalRequisitosArea > 0
                    ? (double) requisitosCompletosArea / totalRequisitosArea * 100
                    : 0.0;

            Map<String, Object> item = new HashMap<>();
            item.put("areaConhecimento", area.getNome());
            item.put("totalEspecialidades", especialidadesArea.size());
            item.put(TOTAL_REQUISITOS, totalRequisitosArea);
            item.put("requisitosCompletos", requisitosCompletosArea);
            item.put(PERCENTUAL_COMPLETO, Math.round(percentualCompleto * 10.0) / 10.0);

            progressao.add(item);
        }

        progressao.sort(
                (a, b) -> Double.compare((Double) b.get(PERCENTUAL_COMPLETO), (Double) a.get(PERCENTUAL_COMPLETO)));

        return progressao;
    }

    public List<Map<String, Object>> obterJovensInativos() {
        List<Jovem> todosJovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .toList();
        List<Map<String, Object>> jovensInativos = new ArrayList<>();
        LocalDate dataLimite = LocalDate.now().minusMonths(3);

        for (Jovem jovem : todosJovens) {
            List<JovemRequisitoEspecialidade> requisitos = jovemRequisitoEspecialidadeRepository
                    .findByJovemIdJovem(jovem.getIdJovem());

            boolean inativo = requisitos.isEmpty() || requisitos.stream()
                    .noneMatch(req -> req.getData_cumprimento().isAfter(dataLimite));

            if (inativo) {
                Map<String, Object> jovemInfo = new HashMap<>();
                jovemInfo.put("nome", jovem.getNome());
                jovemInfo.put(DATA_ENTRADA, jovem.getDataEntrada());
                jovemInfo.put(TOTAL_REQUISITOS, requisitos.size());
                jovemInfo.put("ultimaAtividade", requisitos.stream()
                        .map(JovemRequisitoEspecialidade::getData_cumprimento)
                        .max(LocalDate::compareTo)
                        .orElse(null));

                jovensInativos.add(jovemInfo);
            }
        }

        return jovensInativos;
    }

    public List<Map<String, Object>> obterRankingProgressao() {
        List<Jovem> todosJovens = StreamSupport.stream(jovemRepository.findAll().spliterator(), false)
                .toList();
        List<Map<String, Object>> ranking = new ArrayList<>();

        for (Jovem jovem : todosJovens) {
            List<JovemRequisitoEspecialidade> requisitos = jovemRequisitoEspecialidadeRepository
                    .findByJovemIdJovem(jovem.getIdJovem());

            Map<Integer, Long> requisitosPorEspecialidade = requisitos.stream()
                    .flatMap(req -> req.getRequisito().getEspecialidades().stream())
                    .collect(Collectors.groupingBy(
                            Especialidade::getIdEspecialidade,
                            Collectors.counting()));

            long especialidadesCompletas = 0;
            long especialidadesEmProgresso = 0;

            for (Map.Entry<Integer, Long> entry : requisitosPorEspecialidade.entrySet()) {
                Especialidade esp = especialidadeRepository.findById(entry.getKey()).orElse(null);
                if (esp != null) {
                    if (entry.getValue() >= esp.getTotalRequisitos()) {
                        especialidadesCompletas++;
                    } else {
                        especialidadesEmProgresso++;
                    }
                }
            }

            Map<String, Object> jovemRanking = new HashMap<>();
            jovemRanking.put("nome", jovem.getNome());
            jovemRanking.put(TOTAL_REQUISITOS, requisitos.size());
            jovemRanking.put("especialidadesCompletas", especialidadesCompletas);
            jovemRanking.put("especialidadesEmProgresso", especialidadesEmProgresso);
            jovemRanking.put(DATA_ENTRADA, jovem.getDataEntrada());

            long pontuacao = requisitos.size() + (especialidadesCompletas * 10);
            jovemRanking.put(PONTUACAO, pontuacao);

            ranking.add(jovemRanking);
        }

        ranking.sort((a, b) -> Long.compare((Long) b.get(PONTUACAO), (Long) a.get(PONTUACAO)));

        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).put("posicao", i + 1);
        }

        return ranking;
    }
}