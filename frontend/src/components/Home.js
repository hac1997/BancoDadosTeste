import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { fetchStats } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Home.css';

function Home() {
  const [stats, setStats] = useState({
    totalJovens: 0,
    totalEspecialidades: 0,
    totalRequisitos: 0,
    jovensCruzeiro: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        showAlert('Erro ao carregar estatísticas', 'danger');
      }
    };
    loadStats();
  }, []);

  return (
    <div id="home-section" className="section">
      <div className="hero-section text-center mb-4">
        <h1>
          <i className="fas fa-campground me-3"></i>Sistema Escoteiro
        </h1>
        <p>Gerenciamento completo do Ramo Lobinho</p>
      </div>

      <Container>
        <Row>
          <Col md={4}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <Card.Title>Gestão de Jovens</Card.Title>
                <Card.Text>
                  Cadastre e gerencie informações dos jovens lobinhos, incluindo dados pessoais,
                  contatos e responsáveis.
                </Card.Text>
                <Button variant="primary" href="/jovens">
                  Gerenciar Jovens
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-medal"></i>
                </div>
                <Card.Title>Especialidades</Card.Title>
                <Card.Text>
                  Controle as especialidades disponíveis e acompanhe o progresso dos jovens em cada
                  área de conhecimento.
                </Card.Text>
                <Button variant="primary" href="/especialidades">
                  Ver Especialidades
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <Card.Title>Acompanhamento</Card.Title>
                <Card.Text>
                  Monitore a progressão individual de cada jovem e registre o cumprimento de
                  requisitos.
                </Card.Text>
                <Button variant="primary" href="/progressao">
                  Ver Progressão
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="stats-section mt-4">
          <Row>
            <Col md={3}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalJovens}</div>
                <div className="stat-label">Jovens Cadastrados</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalEspecialidades}</div>
                <div className="stat-label">Especialidades</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalRequisitos}</div>
                <div className="stat-label">Requisitos Cumpridos</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-item">
                <div className="stat-number">{stats.jovensCruzeiro}</div>
                <div className="stat-label">Aptos Cruzeiro do Sul</div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Home;