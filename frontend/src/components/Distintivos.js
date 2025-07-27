import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Table } from 'react-bootstrap';
import { fetchDistintivos, fetchJovensDistintivos } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Distintivos.css';

function Distintivos() {
  const [distintivos, setDistintivos] = useState([]);
  const [insignias, setInsignias] = useState([]);
  const [jovensDistintivos, setJovensDistintivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDistintivos();
    loadInsignias();
    loadJovensDistintivos();
  }, []);

  const loadDistintivos = async () => {
    setLoading(true);
    try {
      // Dados mockados dos distintivos de progressão
      const distintivosData = [
        {
          id: 1,
          nome: "Lobo Pata Tenra",
          descricao: "Primeiro distintivo de progressão para jovens lobinhos",
          cor: "bronze",
          requisitos: 4,
          ordem: 1,
          icon: "paw"
        },
        {
          id: 2,
          nome: "Lobo Saltador",
          descricao: "Segundo distintivo de progressão - desenvolvimento de habilidades básicas",
          cor: "silver",
          requisitos: 6,
          ordem: 2,
          icon: "running"
        },
        {
          id: 3,
          nome: "Lobo Rastreador",
          descricao: "Terceiro distintivo - desenvolvimento de habilidades escoteiras",
          cor: "gold",
          requisitos: 8,
          ordem: 3,
          icon: "search"
        },
        {
          id: 4,
          nome: "Lobo Caçador",
          descricao: "Quarto distintivo - preparação para o Cruzeiro do Sul",
          cor: "platinum",
          requisitos: 10,
          ordem: 4,
          icon: "crosshairs"
        },
        {
          id: 5,
          nome: "Cruzeiro do Sul",
          descricao: "Máxima conquista do ramo lobinho - requer Lobo Caçador + 1 insígnia + 5 especialidades em 3 áreas",
          cor: "diamond",
          requisitos: 15,
          ordem: 5,
          icon: "star"
        }
      ];
      setDistintivos(distintivosData);
    } catch (error) {
      showAlert('Erro ao carregar distintivos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadInsignias = async () => {
    try {
      // Dados mockados das insígnias de interesse especial
      const insigniasData = [
        {
          id: 1,
          nome: "Aprender",
          descricao: "Insígnia de interesse especial focada no desenvolvimento intelectual",
          requisitos: 8,
          area: "Educacional",
          icon: "book"
        },
        {
          id: 2,
          nome: "Servir",
          descricao: "Insígnia de interesse especial focada no serviço comunitário",
          requisitos: 8,
          area: "Comunitário",
          icon: "hands-helping"
        }
      ];
      setInsignias(insigniasData);
    } catch (error) {
      showAlert('Erro ao carregar insígnias', 'danger');
    }
  };

  const loadJovensDistintivos = async () => {
    try {
      // Dados mockados de jovens com distintivos
      const jovensData = [
        {
          id: 1,
          nome: "João Lobinho",
          distintivos: [1, 2, 3],
          insignias: [1],
          progresso: 75,
          proximoDistintivo: "Lobo Caçador"
        },
        {
          id: 2,
          nome: "Maria Escoteira",
          distintivos: [1, 2],
          insignias: [1, 2],
          progresso: 60,
          proximoDistintivo: "Lobo Rastreador"
        }
      ];
      setJovensDistintivos(jovensData);
    } catch (error) {
      showAlert('Erro ao carregar progressão dos jovens', 'danger');
    }
  };

  const getDistintivoColor = (cor) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
      diamond: '#B9F2FF'
    };
    return colors[cor] || '#6c757d';
  };

  return (
    <div id="distintivos-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-award me-2"></i>Distintivos de Progressão e Insígnias
          </h2>

          {/* Distintivos de Progressão */}
          <div className="mb-5">
            <h4 className="mb-3">
              <i className="fas fa-trophy me-2"></i>Distintivos de Progressão
            </h4>
            <Row>
              {distintivos.map((distintivo) => (
                <Col md={6} lg={4} key={distintivo.id} className="mb-3">
                  <Card className="h-100 distintivo-card">
                    <Card.Header 
                      className="text-white text-center"
                      style={{ backgroundColor: getDistintivoColor(distintivo.cor) }}
                    >
                      <i className={`fas fa-${distintivo.icon} fa-2x mb-2`}></i>
                      <h6 className="mb-0">{distintivo.nome}</h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="card-text small">{distintivo.descricao}</p>
                      <div className="mb-2">
                        <Badge bg="primary">{distintivo.requisitos} requisitos</Badge>
                        <Badge bg="secondary" className="ms-1">Ordem: {distintivo.ordem}</Badge>
                      </div>

                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Insígnias de Interesse Especial */}
          <div className="mb-5">
            <h4 className="mb-3">
              <i className="fas fa-certificate me-2"></i>Insígnias de Interesse Especial
            </h4>
            <Row>
              {insignias.map((insignia) => (
                <Col md={6} key={insignia.id} className="mb-3">
                  <Card className="h-100 insignia-card">
                    <Card.Header className="bg-success text-white text-center">
                      <i className={`fas fa-${insignia.icon} fa-2x mb-2`}></i>
                      <h6 className="mb-0">{insignia.nome}</h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="card-text">{insignia.descricao}</p>
                      <div className="mb-2">
                        <Badge bg="success">{insignia.requisitos} requisitos</Badge>
                        <Badge bg="info" className="ms-1">{insignia.area}</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Progressão dos Jovens */}
          <div className="mb-4">
            <h4 className="mb-3">
              <i className="fas fa-chart-line me-2"></i>Progressão dos Jovens
            </h4>
            <Card>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Jovem</th>
                      <th>Distintivos Conquistados</th>
                      <th>Insígnias</th>
                      <th>Progresso</th>
                      <th>Próximo Objetivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jovensDistintivos.map((jovem) => (
                      <tr key={jovem.id}>
                        <td>
                          <strong>{jovem.nome}</strong>
                        </td>
                        <td>
                          {jovem.distintivos.map((distId) => {
                            const dist = distintivos.find(d => d.id === distId);
                            return dist ? (
                              <Badge 
                                key={distId}
                                style={{ 
                                  backgroundColor: getDistintivoColor(dist.cor), 
                                  color: '#000',
                                  marginRight: '4px'
                                }}
                              >
                                <i className={`fas fa-${dist.icon} me-1`}></i>
                                {dist.nome}
                              </Badge>
                            ) : null;
                          })}
                        </td>
                        <td>
                          {jovem.insignias.map((insId) => {
                            const ins = insignias.find(i => i.id === insId);
                            return ins ? (
                              <Badge key={insId} bg="success" className="me-1">
                                <i className={`fas fa-${ins.icon} me-1`}></i>
                                {ins.nome}
                              </Badge>
                            ) : null;
                          })}
                        </td>
                        <td>
                          <ProgressBar 
                            now={jovem.progresso} 
                            label={`${jovem.progresso}%`}
                            style={{ minWidth: '100px' }}
                          />
                        </td>
                        <td>
                          <span className="text-primary">
                            <i className="fas fa-target me-1"></i>
                            {jovem.proximoDistintivo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>

          
        </div>
      </Container>
    </div>
  );
}

export default Distintivos;