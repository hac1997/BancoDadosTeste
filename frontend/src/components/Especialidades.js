import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { fetchEspecialidades, deleteEspecialidade } from '../services/api';
import EspecialidadeModal from './EspecialidadeModal';
import { showAlert } from '../utils/alert';
import '../styles/Especialidades.css';

function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [nivel, setNivel] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);

  useEffect(() => {
    loadEspecialidades();
  }, [nivel]);

  const loadEspecialidades = async () => {
    setLoading(true);
    try {
      const data = await fetchEspecialidades({ nivel });
      setEspecialidades(data);
    } catch (error) {
      showAlert('Erro ao carregar especialidades', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (especialidade) => {
    if (!especialidade || !especialidade.id_especialidade) {
      console.error('Invalid especialidade object:', especialidade);
      return;
    }
    console.log('Editing especialidade:', especialidade);
    setSelectedEspecialidade(especialidade);
    setShowModal(true);
  };

  const handleNewEspecialidade = () => {
    setSelectedEspecialidade({}); // Set to empty object for new especialidade
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta especialidade?')) return;
    try {
      await deleteEspecialidade(id);
      showAlert('Especialidade excluída com sucesso!', 'success');
      loadEspecialidades();
    } catch (error) {
      showAlert('Erro ao excluir especialidade', 'danger');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEspecialidade(null);
  };

  return (
    <div id="especialidades-section" className="section">
      <Container>
        <div className="section-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-medal me-2"></i>Especialidades
            </h2>
            <Button variant="primary" onClick={handleNewEspecialidade}>
              <i className="fas fa-plus me-1"></i>Nova Especialidade
            </Button>
          </div>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                <option value="">Todos os níveis</option>
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button variant="secondary" onClick={loadEspecialidades}>
                <i className="fas fa-sync me-1"></i>Atualizar
              </Button>
            </Col>
          </Row>

          {loading && (
            <div id="especialidades-loading" className="loading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando especialidades...</p>
            </div>
          )}

          <Row id="especialidades-container">
            {especialidades.map((esp) => (
              <Col md={6} lg={4} key={esp.id_especialidade} className="mb-3">
                <Card className="h-100">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="fas fa-medal me-2"></i>
                      {esp.descricao}
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-2">
                      <span className="badge bg-info">Nível {esp.nivel}</span>
                      <span className="badge bg-secondary">{esp.totalRequisitos} requisitos</span>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">
                        Área: {esp.areaConhecimento ? esp.areaConhecimento.nome : 'Não definida'}
                      </small>
                    </p>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(esp)}
                    >
                      <i className="fas fa-edit me-1"></i>Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(esp.id_especialidade)}
                    >
                      <i className="fas fa-trash me-1"></i>Excluir
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          <EspecialidadeModal
            show={showModal}
            handleClose={handleModalClose}
            especialidade={selectedEspecialidade}
            onSave={loadEspecialidades}
          />
        </div>
      </Container>
    </div>
  );
}

export default Especialidades;