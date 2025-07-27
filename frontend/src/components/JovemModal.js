import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createJovem, updateJovem } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function JovemModal({ show, handleClose, jovem = {}, onSave }) {
  const [formData, setFormData] = useState({
    idJovem: jovem?.idJovem || '',
    nome: jovem?.nome || '',
    dataNasc: jovem?.dataNasc || '',
    tipoSanguineo: jovem?.tipoSanguineo || '',
    dataEntrada: jovem?.dataEntrada || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.dataNasc || !formData.dataEntrada) {
      showAlert('Preencha todos os campos obrigatórios', 'warning');
      return;
    }
    try {
      const jovemData = {
        nome: formData.nome,
        dataNasc: formData.dataNasc,
        tipoSanguineo: formData.tipoSanguineo,
        dataEntrada: formData.dataEntrada,
      };
      if (formData.idJovem) {
        await updateJovem(formData.idJovem, jovemData);
        showAlert('Jovem atualizado com sucesso!', 'success');
      } else {
        await createJovem(jovemData);
        showAlert('Jovem cadastrado com sucesso!', 'success');
      }
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao salvar jovem: ' + error.message, 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-user me-2"></i>
          {formData.idJovem ? 'Editar Jovem' : 'Novo Jovem'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data de Nascimento *</Form.Label>
            <Form.Control
              type="date"
              name="dataNasc"
              value={formData.dataNasc}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo Sanguíneo</Form.Label>
            <Form.Select
              name="tipoSanguineo"
              value={formData.tipoSanguineo}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data de Entrada *</Form.Label>
            <Form.Control
              type="date"
              name="dataEntrada"
              value={formData.dataEntrada}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Control
            type="hidden"
            name="idJovem"
            value={formData.idJovem}
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

export default JovemModal;