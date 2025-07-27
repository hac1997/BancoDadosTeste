import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { fetchAtividades, createAtividade, deleteAtividade } from '../services/api';
import AtividadeModal from './AtividadeModal';
import { showAlert } from '../utils/alert';
import '../styles/Atividades.css';

function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAtividade, setSelectedAtividade] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMes, setFiltroMes] = useState('');

  useEffect(() => {
    loadAtividades();
  }, []);

  const loadAtividades = async () => {
    setLoading(true);
    try {
      // Dados mockados de atividades
      const atividadesData = [
        {
          id: 1,
          nome: "Acampamento de Integração",
          descricao: "Primeiro acampamento do ano para integração dos novos lobinhos",
          data: "2024-03-15",
          tipo: "Acampamento",
          local: "Chácara do Grupo",
          participantes: ["João Lobinho", "Maria Escoteira", "Pedro Aventureiro"],
          responsavel: "Chefe Ana",
          status: "Realizada"
        },
        {
          id: 2,
          nome: "Oficina de Radioamadorismo",
          descricao: "Atividade prática para especialidade de Radioamadorismo",
          data: "2024-04-20",
          tipo: "Oficina",
          local: "Sede do Grupo",
          participantes: ["João Lobinho", "Carlos Explorador"],
          responsavel: "Velho Lobo Roberto",
          status: "Realizada"
        },
        {
          id: 3,
          nome: "Caminhada Ecológica",
          descricao: "Caminhada na trilha do parque para observação da natureza",
          data: "2024-05-10",
          tipo: "Atividade Externa",
          local: "Parque Municipal",
          participantes: ["Maria Escoteira", "Ana Corajosa", "Bruno Valente"],
          responsavel: "Chefe João",
          status: "Planejada"
        },
        {
          id: 4,
          nome: "Olimpíadas Lobinhas",
          descricao: "Competições esportivas e jogos entre os lobinhos",
          data: "2024-06-01",
          tipo: "Competição",
          local: "Campo de Futebol",
          participantes: ["Todos os lobinhos"],
          responsavel: "Equipe de Chefes",
          status: "Planejada"
        }
      ];
      setAtividades(atividadesData);
    } catch (error) {
      showAlert('Erro ao carregar atividades', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (atividade) => {
    setSelectedAtividade(atividade);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) return;
    try {
      await deleteAtividade(id);
      showAlert('Atividade excluída com sucesso!', 'success');
      loadAtividades();
    } catch (error) {
      showAlert('Erro ao excluir atividade', 'danger');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAtividade(null);
  };

  const handleNewAtividade = () => {
    setSelectedAtividade({});
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Realizada': { bg: 'success', icon: 'check-circle' },
      'Planejada': { bg: 'primary', icon: 'calendar-alt' },
      'Cancelada': { bg: 'danger', icon: 'times-circle' },
      'Em Andamento': { bg: 'warning', icon: 'clock' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', icon: 'question' };
    return (
      <Badge bg={config.bg}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {status}
      </Badge>
    );
  };

  const getTipoIcon = (tipo) => {
    const tipoIcons = {
      'Acampamento': 'campground',
      'Oficina': 'tools',
      'Atividade Externa': 'hiking',
      'Competição': 'trophy',
      'Reunião': 'users',
      'Cerimônia': 'award'
    };
    return tipoIcons[tipo] || 'calendar';
  };

  const atividadesFiltradas = atividades.filter(atividade => {
    const filtroPorTipo = !filtroTipo || atividade.tipo === filtroTipo;
    const filtroPorMes = !filtroMes || atividade.data.startsWith(filtroMes);
    return filtroPorTipo && filtroPorMes;
  });

  return (
    <div id="atividades-section" className="section">
      <Container>
        <div className="section-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-calendar-alt me-2"></i>Atividades do Grupo
            </h2>
            <Button variant="success" onClick={handleNewAtividade}>
              <i className="fas fa-plus me-1"></i>Nova Atividade
            </Button>
          </div>

          {/* Filtros */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Select 
                value={filtroTipo} 
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="Acampamento">Acampamento</option>
                <option value="Oficina">Oficina</option>
                <option value="Atividade Externa">Atividade Externa</option>
                <option value="Competição">Competição</option>
                <option value="Reunião">Reunião</option>
                <option value="Cerimônia">Cerimônia</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="month"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button variant="outline-primary" onClick={loadAtividades}>
                <i className="fas fa-sync me-1"></i>Atualizar
              </Button>
            </Col>
          </Row>

          {loading && (
            <div className="loading text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando atividades...</p>
            </div>
          )}

          {/* Cards de Atividades */}
          <Row className="mb-4">
            {atividadesFiltradas.map((atividade) => (
              <Col md={6} lg={4} key={atividade.id} className="mb-3">
                <Card className="h-100 atividade-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className={`fas fa-${getTipoIcon(atividade.tipo)} me-2`}></i>
                      <strong>{atividade.nome}</strong>
                    </div>
                    {getStatusBadge(atividade.status)}
                  </Card.Header>
                  <Card.Body>
                    <p className="card-text small text-muted mb-2">{atividade.descricao}</p>
                    <div className="mb-2">
                      <small>
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(atividade.data).toLocaleDateString('pt-BR')}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small>
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {atividade.local}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small>
                        <i className="fas fa-user-tie me-1"></i>
                        {atividade.responsavel}
                      </small>
                    </div>
                    <div className="mb-2">
                      <Badge bg="info">{atividade.tipo}</Badge>
                      <Badge bg="secondary" className="ms-1">
                        {Array.isArray(atividade.participantes) 
                          ? atividade.participantes.length 
                          : 1} participantes
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(atividade)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-1"
                      title="Ver Detalhes"
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(atividade.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Tabela detalhada */}
          {atividadesFiltradas.length > 0 && (
            <Card>
              <Card.Header>
                <h5><i className="fas fa-list me-2"></i>Lista Detalhada de Atividades</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Atividade</th>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Local</th>
                      <th>Responsável</th>
                      <th>Status</th>
                      <th>Participantes</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atividadesFiltradas.map((atividade) => (
                      <tr key={atividade.id}>
                        <td>
                          <strong>{atividade.nome}</strong>
                          <br />
                          <small className="text-muted">{atividade.descricao}</small>
                        </td>
                        <td>{new Date(atividade.data).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <i className={`fas fa-${getTipoIcon(atividade.tipo)} me-1`}></i>
                          {atividade.tipo}
                        </td>
                        <td>{atividade.local}</td>
                        <td>{atividade.responsavel}</td>
                        <td>{getStatusBadge(atividade.status)}</td>
                        <td>
                          {Array.isArray(atividade.participantes) 
                            ? atividade.participantes.length 
                            : 1}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(atividade)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(atividade.id)}
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

          <AtividadeModal
            show={showModal}
            handleClose={handleModalClose}
            atividade={selectedAtividade}
            onSave={loadAtividades}
          />
        </div>
      </Container>
    </div>
  );
}

export default Atividades;