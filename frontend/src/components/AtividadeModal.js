import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAtividade, updateAtividade, fetchJovensForSelect } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function AtividadeModal({ show, handleClose, atividade = {}, onSave }) {
  const [formData, setFormData] = useState({
    id: atividade?.id || '',
    nome: atividade?.nome || '',
    descricao: atividade?.descricao || '',
    data: atividade?.data || '',
    tipo: atividade?.tipo || '',
    local: atividade?.local || '',
    responsavel: atividade?.responsavel || '',
    status: atividade?.status || 'Planejada',
    participantes: atividade?.participantes || [],
  });

  const [jovensDisponiveis, setJovensDisponiveis] = useState([]);

  useEffect(() => {
    loadJovens();
  }, []);

  useEffect(() => {
    if (atividade && Object.keys(atividade).length > 0) {
      setFormData({
        id: atividade.id || '',
        nome: atividade.nome || '',
        descricao: atividade.descricao || '',
        data: atividade.data || '',
        tipo: atividade.tipo || '',
        local: atividade.local || '',
        responsavel: atividade.responsavel || '',
        status: atividade.status || 'Planejada',
        participantes: atividade.participantes || [],
      });
    }
  }, [atividade]);

  const loadJovens = async () => {
    try {
      const jovens = await fetchJovensForSelect();
      setJovensDisponiveis(jovens);
    } catch (error) {
      showAlert('Erro ao carregar jovens', 'danger');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParticipantesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({ ...formData, participantes: selectedOptions });
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.data || !formData.tipo) {
      showAlert('Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    try {
      const atividadeData = {
        nome: formData.nome,
        descricao: formData.descricao,
        data: formData.data,
        tipo: formData.tipo,
        local: formData.local,
        responsavel: formData.responsavel,
        status: formData.status,
        participantes: formData.participantes,
      };

      if (formData.id) {
        await updateAtividade(formData.id, atividadeData);
        showAlert('Atividade atualizada com sucesso!', 'success');
      } else {
        await createAtividade(atividadeData);
        showAlert('Atividade cadastrada com sucesso!', 'success');
      }
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao salvar atividade: ' + error.message, 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-calendar-plus me-2"></i>
          {formData.id ? 'Editar Atividade' : 'Nova Atividade'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Atividade *</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome da atividade"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Data *</Form.Label>
                <Form.Control
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva a atividade, objetivos e procedimentos"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Atividade *</Form.Label>
                <Form.Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Acampamento">Acampamento</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Atividade Externa">Atividade Externa</option>
                  <option value="Competição">Competição</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Cerimônia">Cerimônia</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Planejada">Planejada</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Local</Form.Label>
                <Form.Control
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  placeholder="Local onde será realizada"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Responsável</Form.Label>
                <Form.Control
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  placeholder="Nome do chefe ou responsável"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Participantes</Form.Label>
            <Form.Select
              multiple
              name="participantes"
              value={formData.participantes}
              onChange={handleParticipantesChange}
              style={{ minHeight: '120px' }}
            >
              {jovensDisponiveis.map((jovem) => (
                <option key={jovem.idJovem} value={jovem.nome}>
                  {jovem.nome}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Mantenha pressionado Ctrl (Windows) ou Cmd (Mac) para selecionar múltiplos jovens
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="fas fa-times me-1"></i>Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="fas fa-save me-1"></i>Salvar Atividade
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AtividadeModal;