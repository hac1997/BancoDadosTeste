package ads.bcd.controller;

import ads.bcd.dto.EspecialidadeDTO;
import ads.bcd.model.Especialidade;
import ads.bcd.repository.EspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadeController {

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @GetMapping
    public List<EspecialidadeDTO> getAllEspecialidades(@RequestParam(required = false) String nivel) {
        Iterable<Especialidade> especialidadesIterable = nivel != null && !nivel.isEmpty()
                ? especialidadeRepository.findByNivel(Integer.parseInt(nivel))
                : especialidadeRepository.findAll();
        
        List<Especialidade> especialidades = StreamSupport.stream(especialidadesIterable.spliterator(), false)
                .collect(Collectors.toList());
        
        return especialidades.stream()
                .map(e -> {
                    EspecialidadeDTO dto = new EspecialidadeDTO();
                    dto.setIdEspecialidade(e.getIdEspecialidade());
                    dto.setDescricao(e.getDescricao());
                    dto.setNivel(e.getNivel());
                    dto.setTotalRequisitos(e.getTotalRequisitos());
                    // Assuming AreaConhecimentoDTO is properly set up
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/select")
    public List<EspecialidadeDTO> getEspecialidadesForSelect() {
        Iterable<Especialidade> especialidadesIterable = especialidadeRepository.findAll();
        return StreamSupport.stream(especialidadesIterable.spliterator(), false)
                .map(e -> {
                    EspecialidadeDTO dto = new EspecialidadeDTO();
                    dto.setIdEspecialidade(e.getIdEspecialidade());
                    dto.setDescricao(e.getDescricao());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public EspecialidadeDTO createEspecialidade(@RequestBody EspecialidadeDTO dto) {
        Especialidade especialidade = new Especialidade();
        especialidade.setDescricao(dto.getDescricao());
        especialidade.setNivel(dto.getNivel());
        especialidade.setTotalRequisitos(dto.getTotalRequisitos());
        // Handle AreaConhecimento if needed
        Especialidade saved = especialidadeRepository.save(especialidade);
        EspecialidadeDTO responseDto = new EspecialidadeDTO();
        responseDto.setIdEspecialidade(saved.getIdEspecialidade());
        responseDto.setDescricao(saved.getDescricao());
        responseDto.setNivel(saved.getNivel());
        responseDto.setTotalRequisitos(saved.getTotalRequisitos());
        return responseDto;
    }

    @PutMapping("/{id}")
    public ResponseEntity<EspecialidadeDTO> updateEspecialidade(@PathVariable Integer id, @RequestBody EspecialidadeDTO dto) {
        return especialidadeRepository.findById(id)
                .map(existing -> {
                    existing.setDescricao(dto.getDescricao());
                    existing.setNivel(dto.getNivel());
                    existing.setTotalRequisitos(dto.getTotalRequisitos());
                    // Handle AreaConhecimento if needed
                    Especialidade updated = especialidadeRepository.save(existing);
                    EspecialidadeDTO responseDto = new EspecialidadeDTO();
                    responseDto.setIdEspecialidade(updated.getIdEspecialidade());
                    responseDto.setDescricao(updated.getDescricao());
                    responseDto.setNivel(updated.getNivel());
                    responseDto.setTotalRequisitos(updated.getTotalRequisitos());
                    return ResponseEntity.ok(responseDto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEspecialidade(@PathVariable Integer id) {
        if (especialidadeRepository.existsById(id)) {
            especialidadeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}