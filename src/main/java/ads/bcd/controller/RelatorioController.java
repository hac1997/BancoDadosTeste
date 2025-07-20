package ads.bcd.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ads.bcd.service.RelatorioService;

@RestController
@RequestMapping("api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/estatisticas-gerais")
    public ResponseEntity<Map<String, Object>> obterEstatisticasGerais() {
        Map<String, Object> estatisticas = relatorioService.obterEstatisticasGerais();
        return ResponseEntity.ok(estatisticas);
    }

    @GetMapping("/jovens-por-nivel")
    public ResponseEntity<Map<String, Object>> obterJovensPorNivel() {
        Map<String, Object> relatorio = relatorioService.obterJovensPorNivel();
        return ResponseEntity.ok(relatorio);
    }

    @GetMapping("/especialidades-mais-populares")
    public ResponseEntity<List<Map<String, Object>>> obterEspecialidadesMaisPopulares() {
        List<Map<String, Object>> especialidades = relatorioService.obterEspecialidadesMaisPopulares();
        return ResponseEntity.ok(especialidades);
    }

    @GetMapping("/progressao-por-area")
    public ResponseEntity<List<Map<String, Object>>> obterProgressaoPorArea() {
        List<Map<String, Object>> progressao = relatorioService.obterProgressaoPorArea();
        return ResponseEntity.ok(progressao);
    }

    @GetMapping("/jovens-inativos")
    public ResponseEntity<List<Map<String, Object>>> obterJovensInativos() {
        List<Map<String, Object>> jovensInativos = relatorioService.obterJovensInativos();
        return ResponseEntity.ok(jovensInativos);
    }

    @GetMapping("/ranking-progressao")
    public ResponseEntity<List<Map<String, Object>>> obterRankingProgressao() {
        List<Map<String, Object>> ranking = relatorioService.obterRankingProgressao();
        return ResponseEntity.ok(ranking);
    }
}