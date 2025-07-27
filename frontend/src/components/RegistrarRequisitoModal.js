import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { fetchEspecialidadesForSelect, fetchRequisitosPorEspecialidade, registrarRequisito } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function RegistrarRequisitoModal({ show, handleClose, onSave }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidadeId, setSelectedEspecialidadeId] = useState('');
  const [requisitos, setRequisitos] = useState([]);
  const [selectedRequisitoId, setSelectedRequisitoId] = useState('');
  const [jovemId, setJovemId] = useState('');

  useEffect(() => {
    loadEspecialidades();
  }, []);

  const loadEspecialidades = async () => {
    try {
      const data = await fetchEspecialidadesForSelect();
      setEspecialidades(data);
    } catch (error) {
      showAlert('Erro ao carregar especialidades', 'danger');
    }
  };

  const loadRequisitos = async () => {
    if (!selectedEspecialidadeId) return;
    try {
      const data = await fetchRequisitosPorEspecialidade(selectedEspecialidadeId);
      setRequisitos(data);
    } catch (error) {
      showAlert('Erro ao carregar requisitos', 'danger');
    }
  };

  useEffect(() => {
    loadRequisitos();
  }, [selectedEspecialidadeId]);

  const handleSubmit = async () => {
    if (!jovemId || !selectedRequisitoId) {
      showAlert('Preencha todos os campos', 'warning');
      return;
    }
    try {
      await registrarRequisito({ idJovem: jovemId, idRequisito: selectedRequisitoId });
      showAlert('Requisito registrado com sucesso!', 'success');
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao registrar requisito', 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-check-circle me-2"></i>Registrar Requisito
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>ID do Jovem *</Form.Label>
            <Form.Control
              type="number"
              value={jovemId}
              onChange={(e) => setJovemId(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Especialidade *</Form.Label>
            <Form.Select
              value={selectedEspecialidadeId}
              onChange={(e) => {
                setSelectedEspecialidadeId(e.target.value);
                setSelectedRequisitoId('');
              }}
            >
              <option value="">Selecione...</option>
              {especialidades.map((esp) => (
                <option key={esp.idEspecialidade} value={esp.idEspecialidade}>
                  {esp.descricao}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Requisito *</Form.Label>
            <Form.Select
              value={selectedRequisitoId}
              onChange={(e) => setSelectedRequisitoId(e.target.value)}
              disabled={!selectedEspecialidadeId}
            >
              <option value="">Selecione...</option>
              {requisitos.map((req) => (
                <option key={req.idRequisito} value={req.idRequisito}>
                  {req.requisito}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="fas fa-save me-1"></i>Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegistrarRequisitoModal;