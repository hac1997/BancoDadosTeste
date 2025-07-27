package ads.bcd.controller;

import ads.bcd.dto.EspecialidadeDTO;
import ads.bcd.dto.RequisitoEspecialidadeDTO;
import ads.bcd.model.Especialidade;
import ads.bcd.model.RequisitoEspecialidade;
import ads.bcd.repository.EspecialidadeRepository;
import ads.bcd.repository.RequisitoEspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requisitos")
public class RequisitoController {

    @Autowired
    private RequisitoEspecialidadeRepository requisitoRepository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @GetMapping("/especialidade/{especialidadeId}")
    public List<RequisitoEspecialidadeDTO> getRequisitosPorEspecialidade(@PathVariable Integer especialidadeId) {
        return requisitoRepository.findByEspecialidadeIdEspecialidade(especialidadeId)
                .stream()
                .map(req -> {
                    RequisitoEspecialidadeDTO dto = new RequisitoEspecialidadeDTO();
                    dto.setIdRequisito(req.getIdRequisito());
                    dto.setRequisito(req.getRequisito());
                    dto.setEspecialidades(req.getEspecialidades().stream()
                            .map(esp -> {
                                EspecialidadeDTO espDto = new EspecialidadeDTO();
                                espDto.setIdEspecialidade(esp.getIdEspecialidade());
                                espDto.setDescricao(esp.getDescricao());
                                return espDto;
                            })
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<RequisitoEspecialidadeDTO> createRequisito(@RequestBody RequisitoEspecialidadeDTO dto) {
        if (dto.getEspecialidades() == null || dto.getEspecialidades().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        RequisitoEspecialidade requisito = new RequisitoEspecialidade();
        requisito.setRequisito(dto.getRequisito());

        List<Especialidade> especialidades = dto.getEspecialidades().stream()
                .map(espDto -> especialidadeRepository.findById(espDto.getIdEspecialidade())
                        .orElseThrow(() -> new RuntimeException("Especialidade não encontrada")))
                .collect(Collectors.toList());
        requisito.setEspecialidades(especialidades);

        RequisitoEspecialidade saved = requisitoRepository.save(requisito);

        RequisitoEspecialidadeDTO responseDto = new RequisitoEspecialidadeDTO();
        responseDto.setIdRequisito(saved.getIdRequisito());
        responseDto.setRequisito(saved.getRequisito());
        responseDto.setEspecialidades(saved.getEspecialidades().stream()
                .map(esp -> {
                    EspecialidadeDTO espDto = new EspecialidadeDTO();
                    espDto.setIdEspecialidade(esp.getIdEspecialidade());
                    espDto.setDescricao(esp.getDescricao());
                    return espDto;
                })
                .collect(Collectors.toList()));
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{idRequisito}")
    public ResponseEntity<RequisitoEspecialidadeDTO> updateRequisito(@PathVariable Integer idRequisito, @RequestBody RequisitoEspecialidadeDTO dto) {
        if (dto.getEspecialidades() == null || dto.getEspecialidades().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        return requisitoRepository.findById(idRequisito)
                .map(existing -> {
                    existing.setRequisito(dto.getRequisito());
                    List<Especialidade> especialidades = dto.getEspecialidades().stream()
                            .map(espDto -> especialidadeRepository.findById(espDto.getIdEspecialidade())
                                    .orElseThrow(() -> new RuntimeException("Especialidade não encontrada")))
                            .collect(Collectors.toList());
                    existing.setEspecialidades(especialidades);

                    RequisitoEspecialidade updated = requisitoRepository.save(existing);

                    RequisitoEspecialidadeDTO responseDto = new RequisitoEspecialidadeDTO();
                    responseDto.setIdRequisito(updated.getIdRequisito());
                    responseDto.setRequisito(updated.getRequisito());
                    responseDto.setEspecialidades(updated.getEspecialidades().stream()
                            .map(esp -> {
                                EspecialidadeDTO espDto = new EspecialidadeDTO();
                                espDto.setIdEspecialidade(esp.getIdEspecialidade());
                                espDto.setDescricao(esp.getDescricao());
                                return espDto;
                            })
                            .collect(Collectors.toList()));
                    return ResponseEntity.ok(responseDto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{idRequisito}")
    public ResponseEntity<Void> deleteRequisito(@PathVariable Integer idRequisito) {
        if (requisitoRepository.existsById(idRequisito)) {
            requisitoRepository.deleteById(idRequisito);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}