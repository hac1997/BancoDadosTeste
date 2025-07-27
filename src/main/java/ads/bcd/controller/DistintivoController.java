package ads.bcd.controller;

import ads.bcd.model.DistintivosDeProgressao;
import ads.bcd.service.DistintivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/distintivos")
public class DistintivoController {

    @Autowired
    private DistintivoService distintivoService;

    @GetMapping
    public List<DistintivosDeProgressao> getAllDistintivos() {
        return distintivoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DistintivosDeProgressao> getDistintivoById(@PathVariable Integer id) {
        Optional<DistintivosDeProgressao> distintivo = distintivoService.buscarPorId(id);
        return distintivo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DistintivosDeProgressao createDistintivo(@RequestBody DistintivosDeProgressao distintivo) {
        return distintivoService.salvar(distintivo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DistintivosDeProgressao> updateDistintivo(@PathVariable Integer id, @RequestBody DistintivosDeProgressao distintivo) {
        if (!distintivoService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        distintivo.setIdDistintivo(id);
        return ResponseEntity.ok(distintivoService.salvar(distintivo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistintivo(@PathVariable Integer id) {
        if (!distintivoService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        distintivoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jovens")
    public ResponseEntity<List<Map<String, Object>>> getJovensComDistintivos() {
        List<Map<String, Object>> jovensDistintivos = distintivoService.obterJovensComDistintivos();
        return ResponseEntity.ok(jovensDistintivos);
    }
}