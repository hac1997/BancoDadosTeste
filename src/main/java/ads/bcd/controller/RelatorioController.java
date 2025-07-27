package ads.bcd.controller;

import ads.bcd.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/estatisticas-gerais")
    public ResponseEntity<Map<String, Object>> obterEstatisticasGerais() {
        return ResponseEntity.ok(relatorioService.obterEstatisticasGerais());
    }

    @GetMapping("/jovens-por-nivel")
    public ResponseEntity<Map<String, Object>> obterJovensPorNivel() {
        return ResponseEntity.ok(relatorioService.obterJovensPorNivel());
    }

    @GetMapping("/especialidades-populares")
    public ResponseEntity<List<Map<String, Object>>> obterEspecialidadesPopulares() {
        return ResponseEntity.ok(relatorioService.obterEspecialidadesMaisPopulares());
    }

    @GetMapping("/progressao-por-area")
    public ResponseEntity<List<Map<String, Object>>> obterProgressaoPorArea() {
        return ResponseEntity.ok(relatorioService.obterProgressaoPorArea());
    }

    @GetMapping("/jovens-inativos")
    public ResponseEntity<List<Map<String, Object>>> obterJovensInativos() {
        return ResponseEntity.ok(relatorioService.obterJovensInativos());
    }

    @GetMapping("/ranking-progressao")
    public ResponseEntity<List<Map<String, Object>>> obterRankingProgressao() {
        return ResponseEntity.ok(relatorioService.obterRankingProgressao());
    }

    @GetMapping("/jovem/{id}")
    public ResponseEntity<Map<String, Object>> obterDadosJovem(@PathVariable Integer id) {
        return ResponseEntity.ok(relatorioService.obterDadosJovem(id));
    }
}