import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { fetchEspecialidadesForSelect, fetchRequisitosPorEspecialidade, deleteRequisito } from '../services/api';
import RequisitoModal from './RequisitoModal';
import { showAlert } from '../utils/alert';
import '../styles/Requisitos.css';

function Requisitos() {
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidadeId, setSelectedEspecialidadeId] = useState('');
  const [requisitos, setRequisitos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequisito, setSelectedRequisito] = useState(null);

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
    if (!selectedEspecialidadeId) {
      showAlert('Selecione uma especialidade primeiro', 'warning');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchRequisitosPorEspecialidade(selectedEspecialidadeId);
      setRequisitos(data);
    } catch (error) {
      showAlert('Erro ao carregar requisitos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requisito) => {
    setSelectedRequisito(requisito);
    setShowModal(true);
  };

  const handleDelete = async (idRequisito) => {
    if (!window.confirm('Tem certeza que deseja excluir este requisito?')) return;
    try {
      await deleteRequisito(idRequisito);
      showAlert('Requisito excluído com sucesso!', 'success');
      loadRequisitos();
    } catch (error) {
      showAlert('Erro ao excluir requisito', 'danger');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRequisito(null);
  };

  return (
    <div id="requisitos-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-tasks me-2"></i>Gestão de Requisitos
          </h2>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Select
                value={selectedEspecialidadeId}
                onChange={(e) => {
                  setSelectedEspecialidadeId(e.target.value);
                  setRequisitos([]);
                }}
              >
                <option value="">Selecione uma especialidade...</option>
                {especialidades.map((esp) => (
                  <option key={esp.idEspecialidade} value={esp.idEspecialidade}>
                    {esp.descricao}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={loadRequisitos}>
                <i className="fas fa-search me-1"></i>Consultar
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="success"
                onClick={() => setShowModal(true)}
                disabled={!selectedEspecialidadeId}
              >
                <i className="fas fa-plus me-1"></i>Novo Requisito
              </Button>
            </Col>
          </Row>

          {loading && (
            <div id="requisitos-loading" className="loading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando requisitos...</p>
            </div>
          )}

          {requisitos.length > 0 && (
            <Card>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Especialidades</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisitos.map((req) => (
                      <tr key={req.idRequisito}>
                        <td>{req.requisito}</td>
                        <td>{req.especialidades.map(esp => esp.descricao).join(', ')}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(req)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(req.idRequisito)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          <RequisitoModal
            show={showModal}
            handleClose={handleModalClose}
            requisito={selectedRequisito}
            onSave={loadRequisitos}
          />
        </div>
      </Container>
    </div>
  );
}

export default Requisitos;