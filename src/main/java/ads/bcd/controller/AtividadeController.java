package ads.bcd.controller;

import ads.bcd.model.Atividade;
import ads.bcd.service.AtividadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    @Autowired
    private AtividadeService atividadeService;

    @GetMapping
    public List<Atividade> getAllAtividades() {
        return atividadeService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> getAtividadeById(@PathVariable Integer id) {
        Optional<Atividade> atividade = atividadeService.buscarPorId(id);
        return atividade.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Atividade createAtividade(@RequestBody Atividade atividade) {
        return atividadeService.salvar(atividade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atividade> updateAtividade(@PathVariable Integer id, @RequestBody Atividade atividade) {
        if (!atividadeService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        atividade.setId_atividade(id);
        return ResponseEntity.ok(atividadeService.salvar(atividade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtividade(@PathVariable Integer id) {
        if (!atividadeService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        atividadeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}