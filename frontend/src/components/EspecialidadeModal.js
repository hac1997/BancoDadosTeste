import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createEspecialidade, updateEspecialidade } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function EspecialidadeModal({ show, handleClose, especialidade = {}, onSave }) {
  const [formData, setFormData] = useState({
    id: especialidade?.id_especialidade || '',
    descricao: especialidade?.descricao || '',
    nivel: especialidade?.nivel || '',
    areaConhecimento: especialidade?.areaConhecimento?.nome || '',
    totalRequisitos: especialidade?.totalRequisitos || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.descricao || !formData.nivel || !formData.areaConhecimento || !formData.totalRequisitos) {
      showAlert('Preencha todos os campos obrigatórios', 'warning');
      return;
    }
    try {
      const especialidadeData = {
        descricao: formData.descricao,
        nivel: parseInt(formData.nivel),
        areaConhecimento: { nome: formData.areaConhecimento },
        totalRequisitos: parseInt(formData.totalRequisitos),
      };
      if (formData.id) {
        await updateEspecialidade(formData.id, especialidadeData);
        showAlert('Especialidade atualizada com sucesso!', 'success');
      } else {
        await createEspecialidade(especialidadeData);
        showAlert('Especialidade cadastrada com sucesso!', 'success');
      }
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao salvar especialidade: ' + error.message, 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-medal me-2"></i>
          {formData.id ? 'Editar Especialidade' : 'Nova Especialidade'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="especialidade-form">
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Descrição *</Form.Label>
                <Form.Control
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nível *</Form.Label>
                <Form.Select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="1">Nível 1</option>
                  <option value="2">Nível 2</option>
                  <option value="3">Nível 3</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Área de Conhecimento *</Form.Label>
                <Form.Control
                  type="text"
                  name="areaConhecimento"
                  value={formData.areaConhecimento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total de Requisitos *</Form.Label>
                <Form.Control
                  type="number"
                  name="totalRequisitos"
                  value={formData.totalRequisitos}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Control
            type="hidden"
            id="especialidade-id"
            name="id"
            value={formData.id}
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

export default EspecialidadeModal;