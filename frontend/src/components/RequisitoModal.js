import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createRequisito, updateRequisito, fetchEspecialidadesForSelect } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function RequisitoModal({ show, handleClose, requisito = {}, onSave }) {
  const [formData, setFormData] = useState({
    idRequisito: requisito.idRequisito || '',
    requisito: requisito.requisito || '',
    especialidades: requisito.especialidades || [],
  });
  const [especialidades, setEspecialidades] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEspecialidadesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => ({
      idEspecialidade: parseInt(option.value),
      descricao: option.text,
    }));
    setFormData({ ...formData, especialidades: selectedOptions });
  };

  const handleSubmit = async () => {
    if (!formData.requisito || formData.especialidades.length === 0) {
      showAlert('Preencha a descrição e selecione pelo menos uma especialidade', 'warning');
      return;
    }
    try {
      const requisitoData = {
        requisito: formData.requisito,
        especialidades: formData.especialidades,
      };
      if (formData.idRequisito) {
        await updateRequisito(formData.idRequisito, requisitoData);
        showAlert('Requisito atualizado com sucesso!', 'success');
      } else {
        await createRequisito(requisitoData);
        showAlert('Requisito cadastrado com sucesso!', 'success');
      }
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao salvar requisito', 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-tasks me-2"></i>
          {formData.idRequisito ? 'Editar Requisito' : 'Novo Requisito'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Descrição *</Form.Label>
            <Form.Control
              type="text"
              name="requisito"
              value={formData.requisito}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Especialidades *</Form.Label>
            <Form.Select
              multiple
              value={formData.especialidades.map(esp => esp.idEspecialidade)}
              onChange={handleEspecialidadesChange}
            >
              {especialidades.map(esp => (
                <option key={esp.idEspecialidade} value={esp.idEspecialidade}>
                  {esp.descricao}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Control
            type="hidden"
            name="idRequisito"
            value={formData.idRequisito}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="fas fa-save me-1"></i>Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RequisitoModal;