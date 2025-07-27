package ads.bcd.controller;

import ads.bcd.model.Insignia;
import ads.bcd.service.InsigniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/insignias")
public class InsigniaController {

    @Autowired
    private InsigniaService insigniaService;

    @GetMapping
    public List<Insignia> getAllInsignias() {
        return insigniaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Insignia> getInsigniaById(@PathVariable Integer id) {
        Optional<Insignia> insignia = insigniaService.buscarPorId(id);
        return insignia.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Insignia createInsignia(@RequestBody Insignia insignia) {
        return insigniaService.salvar(insignia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Insignia> updateInsignia(@PathVariable Integer id, @RequestBody Insignia insignia) {
        if (!insigniaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        insignia.setIdInsignia(id);
        return ResponseEntity.ok(insigniaService.salvar(insignia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInsignia(@PathVariable Integer id) {
        if (!insigniaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        insigniaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}