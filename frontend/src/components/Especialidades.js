import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from 'react-bootstrap';
import { fetchEspecialidades, deleteEspecialidade } from '../services/api';
import EspecialidadeModal from './EspecialidadeModal';
import { showAlert } from '../utils/alert';
import '../styles/Especialidades.css';

function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [nivel, setNivel] = useState('');
  const [areaConhecimento, setAreaConhecimento] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);

  const areasConhecimento = [
    'Ciência e Tecnologia',
    'Cultura', 
    'Desportos',
    'Habilidades Escoteiras',
    'Serviços'
  ];

  useEffect(() => {
    loadEspecialidades();
  }, [nivel, areaConhecimento]);

  const loadEspecialidades = async () => {
    setLoading(true);
    try {
      const data = await fetchEspecialidades({ nivel, areaConhecimento });
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
    setSelectedEspecialidade(especialidade);
    setShowModal(true);
  };

  const handleNewEspecialidade = () => {
    setSelectedEspecialidade({});
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

  const getNivelColor = (nivel) => {
    const cores = {
      1: 'success',   // Verde para nível 1
      2: 'warning',   // Amarelo para nível 2  
      3: 'danger'     // Vermelho para nível 3
    };
    return cores[nivel] || 'secondary';
  };

  const getAreaIcon = (area) => {
    const icons = {
      'Ciência e Tecnologia': 'laptop-code',
      'Cultura': 'palette',
      'Desportos': 'running',
      'Habilidades Escoteiras': 'compass',
      'Serviços': 'hands-helping'
    };
    return icons[area] || 'medal';
  };

  const getProgressoRequisitos = (esp) => {
    // Simulação de progresso baseado em dados mockados
    const progresso = Math.floor(Math.random() * 100);
    return progresso;
  };

  return (
    <div id="especialidades-section" className="section">
      <Container>
        <div className="section-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-medal me-2"></i>Especialidades - Ramo Lobinho
            </h2>
            <Button variant="primary" onClick={handleNewEspecialidade}>
              <i className="fas fa-plus me-1"></i>Nova Especialidade
            </Button>
          </div>

          {/* Informações sobre especialidades */}
          <div className="alert alert-info mb-4">
            <h6><i className="fas fa-info-circle me-2"></i>Sistema de Especialidades</h6>
            <Row>
              <Col md={4}>
                <strong>Nível 1:</strong> Cumprimento de 1/3 dos requisitos
              </Col>
              <Col md={4}>
                <strong>Nível 2:</strong> Cumprimento de 2/3 dos requisitos
              </Col>
              <Col md={4}>
                <strong>Nível 3:</strong> Cumprimento de todos os requisitos
              </Col>
            </Row>
          </div>

          {/* Filtros */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                <option value="">Todos os níveis</option>
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={areaConhecimento} onChange={(e) => setAreaConhecimento(e.target.value)}>
                <option value="">Todas as áreas</option>
                {areasConhecimento.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
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

          {/* Áreas de Conhecimento */}
          <div className="mb-4">
            <h5><i className="fas fa-layer-group me-2"></i>Áreas de Conhecimento</h5>
            <Row>
              {areasConhecimento.map((area) => (
                <Col md={2} key={area} className="mb-2">
                  <Card className="text-center h-100 area-card">
                    <Card.Body className="py-2">
                      <i className={`fas fa-${getAreaIcon(area)} fa-2x mb-2 text-primary`}></i>
                      <h6 className="card-title small">{area}</h6>
                      <Badge bg="light" text="dark">
                        {especialidades.filter(esp => 
                          esp.areaConhecimento && esp.areaConhecimento.nome === area
                        ).length} especialidades
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Cards de Especialidades */}
          <Row id="especialidades-container">
            {especialidades.map((esp) => {
              const progresso = getProgressoRequisitos(esp);
              return (
                <Col md={6} lg={4} key={esp.id_especialidade} className="mb-3">
                  <Card className="h-100 especialidade-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className={`fas fa-${getAreaIcon(esp.areaConhecimento?.nome)} me-2`}></i>
                        <strong>{esp.descricao}</strong>
                      </div>
                      <Badge bg={getNivelColor(esp.nivel)}>
                        Nível {esp.nivel}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          <i className="fas fa-layer-group me-1"></i>
                          Área: {esp.areaConhecimento ? esp.areaConhecimento.nome : 'Não definida'}
                        </small>
                        <small className="text-muted d-block">
                          <i className="fas fa-tasks me-1"></i>
                          {esp.totalRequisitos} requisitos no total
                        </small>
                      </div>
                      
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Progresso médio dos jovens:</small>
                        <ProgressBar 
                          now={progresso} 
                          label={`${progresso}%`}
                          variant={progresso > 75 ? 'success' : progresso > 50 ? 'warning' : 'info'}
                        />
                      </div>

                      <div className="nivels-info">
                        <small className="text-muted">
                          <strong>Requisitos por nível:</strong><br/>
                          • Nível 1: {Math.ceil(esp.totalRequisitos / 3)} requisitos<br/>
                          • Nível 2: {Math.ceil((esp.totalRequisitos * 2) / 3)} requisitos<br/>
                          • Nível 3: {esp.totalRequisitos} requisitos
                        </small>
                      </div>
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
                        variant="outline-info"
                        size="sm"
                        className="me-1"
                        title="Ver Requisitos"
                      >
                        <i className="fas fa-list me-1"></i>Requisitos
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
              );
            })}
          </Row>

          {especialidades.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="fas fa-medal fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">Nenhuma especialidade encontrada</h5>
              <p className="text-muted">Use os filtros acima ou cadastre uma nova especialidade</p>
            </div>
          )}

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