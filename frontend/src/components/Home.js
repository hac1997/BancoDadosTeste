import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { fetchStats } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Home.css';

function Home() {
  const [stats, setStats] = useState({
    totalJovens: 0,
    totalEspecialidades: 0,
    totalRequisitos: 0,
    jovensCruzeiro: 0,
    distintivosConquistados: 0,
    insigniasConquistadas: 0,
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
          <i className="fas fa-campground me-3"></i>Sistema Escoteiro - Ramo Lobinho
        </h1>
        <p className="lead">Gerenciamento completo de progressão dos jovens lobinhos</p>
      </div>

      <Container>
        <Row>
          <Col md={4}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <Card.Title>Gestão de Jovens Lobinhos</Card.Title>
                <Card.Text>
                  Cadastre dados biográficos, contatos, responsáveis, saúde e acompanhe 
                  a participação em atividades dos jovens lobinhos.
                </Card.Text>
                <Button variant="primary" href="/jovens">
                  <i className="fas fa-paw me-1"></i>Gerenciar Jovens
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
                  Gerencie as 5 áreas de conhecimento e especialidades com 3 níveis. 
                  Controle requisitos e progressão individual.
                </Card.Text>
                <Button variant="primary" href="/especialidades">
                  <i className="fas fa-star me-1"></i>Ver Especialidades
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <Card.Title>Distintivos & Insígnias</Card.Title>
                <Card.Text>
                  Acompanhe distintivos de progressão (Pata Tenra ao Cruzeiro do Sul) 
                  e insígnias de interesse especial.
                </Card.Text>
                <Button variant="primary" href="/distintivos">
                  <i className="fas fa-award me-1"></i>Ver Distintivos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <Card.Title>Acompanhamento de Progressão</Card.Title>
                <Card.Text>
                  Monitore o progresso individual, registre cumprimento de requisitos 
                  e acompanhe a evolução rumo ao Cruzeiro do Sul.
                </Card.Text>
                <Button variant="primary" href="/progressao">
                  <i className="fas fa-climbing me-1"></i>Ver Progressão
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="feature-card mb-3">
              <Card.Body>
                <div className="feature-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <Card.Title>Atividades</Card.Title>
                <Card.Text>
                  Registre e acompanhe a participação dos jovens em atividades, 
                  acampamentos e eventos do grupo escoteiro.
                </Card.Text>
                <Button variant="primary" href="/atividades">
                  <i className="fas fa-hiking me-1"></i>Ver Atividades
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="stats-section mt-4">
          <h3 className="text-center mb-4">
            <i className="fas fa-chart-bar me-2"></i>Estatísticas do Grupo
          </h3>
          <Row>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalJovens}</div>
                <div className="stat-label">Jovens Lobinhos</div>
              </div>
            </Col>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalEspecialidades}</div>
                <div className="stat-label">Especialidades</div>
              </div>
            </Col>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.totalRequisitos}</div>
                <div className="stat-label">Requisitos Cumpridos</div>
              </div>
            </Col>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.distintivosConquistados}</div>
                <div className="stat-label">Distintivos</div>
              </div>
            </Col>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.insigniasConquistadas}</div>
                <div className="stat-label">Insígnias</div>
              </div>
            </Col>
            <Col md={2}>
              <div className="stat-item">
                <div className="stat-number">{stats.jovensCruzeiro}</div>
                <div className="stat-label">Aptos Cruzeiro do Sul</div>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="mt-4">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <h5><i className="fas fa-lightbulb me-2"></i>Áreas de Conhecimento das Especialidades</h5>
                <Row>
                  <Col md={2} className="text-center mb-2">
                    <div className="knowledge-area">
                      <i className="fas fa-laptop-code fa-2x text-primary mb-1"></i>
                      <div className="small">Ciência e Tecnologia</div>
                    </div>
                  </Col>
                  <Col md={2} className="text-center mb-2">
                    <div className="knowledge-area">
                      <i className="fas fa-palette fa-2x text-success mb-1"></i>
                      <div className="small">Cultura</div>
                    </div>
                  </Col>
                  <Col md={2} className="text-center mb-2">
                    <div className="knowledge-area">
                      <i className="fas fa-running fa-2x text-warning mb-1"></i>
                      <div className="small">Desportos</div>
                    </div>
                  </Col>
                  <Col md={3} className="text-center mb-2">
                    <div className="knowledge-area">
                      <i className="fas fa-compass fa-2x text-info mb-1"></i>
                      <div className="small">Habilidades Escoteiras</div>
                    </div>
                  </Col>
                  <Col md={3} className="text-center mb-2">
                    <div className="knowledge-area">
                      <i className="fas fa-hands-helping fa-2x text-danger mb-1"></i>
                      <div className="small">Serviços</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;