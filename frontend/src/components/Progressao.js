import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ProgressBar, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import {
  fetchJovensForSelect,
  fetchProgressaoJovem,
  fetchEspecialidadesForSelect,
} from '../services/api';
import RegistrarRequisitoModal from './RegistrarRequisitoModal';
import { showAlert } from '../utils/alert';
import '../styles/Progressao.css';

function Progressao() {
  const [jovens, setJovens] = useState([]);
  const [selectedJovemId, setSelectedJovemId] = useState('');
  const [progressao, setProgressao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadJovensForSelect();
    if (location.state?.jovemId) {
      setSelectedJovemId(location.state.jovemId);
      loadProgressaoJovem(location.state.jovemId);
    }
  }, [location.state]);

  const loadJovensForSelect = async () => {
    try {
      const data = await fetchJovensForSelect();
      setJovens(data);
    } catch (error) {
      showAlert('Erro ao carregar jovens para seleção', 'danger');
    }
  };

  const loadProgressaoJovem = async (jovemId) => {
    const id = jovemId || selectedJovemId;
    if (!id) {
      showAlert('Selecione um jovem primeiro', 'warning');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchProgressaoJovem(id);
      setProgressao(data);
    } catch (error) {
      showAlert('Erro ao carregar progressão do jovem', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div id="progressao-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-chart-line me-2"></i>Acompanhamento de Progressão
          </h2>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Select
                id="select-jovem-progressao"
                value={selectedJovemId}
                onChange={(e) => {
                  setSelectedJovemId(e.target.value);
                  setProgressao(null); // Clear current progression when selecting a new jovem
                }}
              >
                <option value="">Selecione um jovem...</option>
                {jovens.map((jovem) => (
                  <option key={jovem.idJovem} value={jovem.idJovem}>
                    {jovem.nome}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={() => loadProgressaoJovem()}>
                <i className="fas fa-search me-1"></i>Consultar
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-1"></i>Registrar Requisito
              </Button>
            </Col>
          </Row>

          {loading && (
            <div id="progressao-loading" className="loading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando progressão...</p>
            </div>
          )}

          {progressao && (
            <div id="progressao-content">
              <Alert variant="info">
                <h5>
                  <i className="fas fa-info-circle me-2"></i>Informações do Jovem
                </h5>
                <Row>
                  <Col md={6}>
                    <strong>Nome:</strong> {progressao.nomeJovem}
                    <br />
                    <strong>Data de Nascimento:</strong> {formatDate(progressao.jovem.data_Nasc)}
                    <br />
                    <strong>Tipo Sanguíneo:</strong>{' '}
                    <span className="badge bg-info">{progressao.jovem.tipoSanguineo}</span>
                  </Col>
                  <Col md={6}>
                    <strong>Data de Entrada:</strong> {formatDate(progressao.jovem.dataEntrada)}
                    <br />
                    <strong>Alergias:</strong> {progressao.jovem.alergias || 'Nenhuma'}
                    <br />
                    <strong>Contato:</strong>{' '}
                    {progressao.jovem.contato ? progressao.jovem.contato.telefone : 'Não informado'}
                  </Col>
                </Row>
              </Alert>

              <div id="especialidades-progress">
                <h5>
                  <i className="fas fa-chart-bar me-2"></i>Progresso nas Especialidades
                </h5>
                {progressao.especialidades.map((esp) => {
                  const badgeClass =
                    esp.nivel === 3
                      ? 'bg-success'
                      : esp.nivel === 2
                      ? 'bg-warning'
                      : 'bg-info';
                  return (
                    <Card key={esp.especialidade.idEspecialidade} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{esp.especialidade.descricao}</h6>
                          <span className={`badge ${badgeClass}`}>Nível {esp.nivel}</span>
                        </div>
                        <ProgressBar now={esp.percentual} style={{ height: '10px' }} />
                        <small className="text-muted">
                          {esp.requisitos_completos} de {esp.total_requisitos} requisitos completos (
                          {esp.percentual.toFixed(1)}%)
                        </small>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
      <RegistrarRequisitoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={loadProgressaoJovem}
      />
    </div>
  );
}

export default Progressao;