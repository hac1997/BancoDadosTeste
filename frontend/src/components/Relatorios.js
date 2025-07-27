import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { 
  fetchRelatoriosCruzeiroDoSul, 
  fetchJovensForSelect, 
  fetchEspecialidadesForSelect,
  fetchProgressaoJovem 
} from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Relatorios.css';

function Relatorios() {
  const [estatisticasGerais, setEstatisticasGerais] = useState({});
  const [jovensCruzeiro, setJovensCruzeiro] = useState([]);
  const [jovensEspecialidade, setJovensEspecialidade] = useState([]);
  const [progressaoJovem, setProgressaoJovem] = useState(null);
  const [requisitosJovem, setRequisitosJovem] = useState([]);
  
  // Filtros
  const [jovemSelecionado, setJovemSelecionado] = useState('');
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  
  // Dados para seleção
  const [jovens, setJovens] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    fetchDadosIniciais();
    fetchEstatisticasGerais();
    fetchJovensCruzeiroDoSul();
  }, []);

  const fetchDadosIniciais = async () => {
    try {
      const [jovensData, especialidadesData] = await Promise.all([
        fetchJovensForSelect(),
        fetchEspecialidadesForSelect()
      ]);
      setJovens(jovensData);
      setEspecialidades(especialidadesData);
    } catch (error) {
      showAlert('Erro ao carregar dados iniciais', 'danger');
    }
  };

  const fetchEstatisticasGerais = async () => {
    try {
      // Dados mockados para estatísticas gerais
      const stats = {
        totalJovens: 10,
        totalEspecialidades: 9,
        totalRequisitosCumpridos: 45,
        jovensAptosCruzeiro: 2,
        mediaIdade: 8.5,
        distribuicaoTipoSanguineo: {
          'O+': 4,
          'A+': 3,
          'B+': 2,
          'AB+': 1
        },
        mediaRequisitosPorJovem: 4.5
      };
      setEstatisticasGerais(stats);
    } catch (error) {
      showAlert('Erro ao carregar estatísticas gerais', 'danger');
    }
  };

  const fetchJovensCruzeiroDoSul = async () => {
    try {
      const jovensData = await fetchRelatoriosCruzeiroDoSul();
      setJovensCruzeiro(jovensData);
    } catch (error) {
      // Dados mockados para jovens aptos ao Cruzeiro do Sul
      const jovensMock = [
        {
          nome: "João Lobinho",
          idade: 10,
          dataEntrada: "2022-01-15",
          distintivosConquistados: ["Lobo Pata Tenra", "Lobo Saltador", "Lobo Rastreador", "Lobo Caçador"],
          especialidades: 6,
          areasEspecialidades: 4,
          insignias: ["Aprender"],
          status: "Apto",
          observacoes: "Cumpre todos os requisitos para o Cruzeiro do Sul"
        },
        {
          nome: "Maria Escoteira",
          idade: 9,
          dataEntrada: "2021-09-01",
          distintivosConquistados: ["Lobo Pata Tenra", "Lobo Saltador", "Lobo Rastreador"],
          especialidades: 5,
          areasEspecialidades: 3,
          insignias: ["Aprender", "Servir"],
          status: "Quase Apto",
          observacoes: "Precisa conquistar o distintivo Lobo Caçador"
        }
      ];
      setJovensCruzeiro(jovensMock);
    }
  };

  const buscarJovensComEspecialidade = async () => {
    if (!especialidadeSelecionada) {
      showAlert('Selecione uma especialidade', 'warning');
      return;
    }
    
    try {
      // Dados mockados
      const jovensData = [
        {
          nome: "João Lobinho",
          nivel: 3,
          dataConquista: "2024-09-15",
          requisitosCompletos: 12,
          totalRequisitos: 12
        },
        {
          nome: "Carlos Explorador",
          nivel: 2,
          dataConquista: "2024-10-01",
          requisitosCompletos: 8,
          totalRequisitos: 12
        }
      ];
      setJovensEspecialidade(jovensData);
    } catch (error) {
      showAlert('Erro ao buscar jovens com especialidade', 'danger');
    }
  };

  const buscarDadosJovem = async () => {
    if (!jovemSelecionado) {
      showAlert('Selecione um jovem', 'warning');
      return;
    }
    
    try {
      const progressao = await fetchProgressaoJovem(jovemSelecionado);
      setProgressaoJovem(progressao);
      
      // Dados mockados de requisitos
      const requisitos = [
        {
          especialidade: "Radioamadorismo",
          requisito: "Montar antena básica",
          dataCumprimento: "2024-08-01",
          status: "Completo"
        },
        {
          especialidade: "Radioamadorismo", 
          requisito: "Fazer transmissão",
          dataCumprimento: "2024-08-10",
          status: "Completo"
        },
        {
          especialidade: "Criptografia",
          requisito: "Decifrar código simples",
          dataCumprimento: "2024-09-05",
          status: "Completo"
        }
      ];
      setRequisitosJovem(requisitos);
    } catch (error) {
      showAlert('Erro ao buscar dados do jovem', 'danger');
    }
  };

  const exportarCSV = (dados, nomeArquivo, cabecalhos) => {
    const csv = [
      cabecalhos.join(','),
      ...dados.map(linha => Object.values(linha).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, nomeArquivo);
  };

  return (
    <div id="relatorios-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-chart-bar me-2"></i>Relatórios do Ramo Lobinho
          </h2>

          {/* Estatísticas Gerais */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="fas fa-chart-pie me-2"></i>Estatísticas Gerais</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="stat-box text-center p-3 bg-primary text-white rounded">
                    <h3>{estatisticasGerais.totalJovens}</h3>
                    <p className="mb-0">Jovens Lobinhos</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box text-center p-3 bg-success text-white rounded">
                    <h3>{estatisticasGerais.totalEspecialidades}</h3>
                    <p className="mb-0">Especialidades</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box text-center p-3 bg-warning text-white rounded">
                    <h3>{estatisticasGerais.totalRequisitosCumpridos}</h3>
                    <p className="mb-0">Requisitos Cumpridos</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stat-box text-center p-3 bg-info text-white rounded">
                    <h3>{estatisticasGerais.jovensAptosCruzeiro}</h3>
                    <p className="mb-0">Aptos Cruzeiro do Sul</p>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <h6>Distribuição por Tipo Sanguíneo</h6>
                  {estatisticasGerais.distribuicaoTipoSanguineo && 
                    Object.entries(estatisticasGerais.distribuicaoTipoSanguineo).map(([tipo, quantidade]) => (
                      <Badge key={tipo} bg="secondary" className="me-2">
                        {tipo}: {quantidade}
                      </Badge>
                    ))
                  }
                </Col>
                <Col md={6}>
                  <h6>Médias</h6>
                  <p>Idade média: {estatisticasGerais.mediaIdade} anos</p>
                  <p>Requisitos por jovem: {estatisticasGerais.mediaRequisitosPorJovem}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Relatório 1: Dados Biográficos de um Jovem */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="fas fa-user me-2"></i>1. Dados Biográficos de um Jovem</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Select 
                    value={jovemSelecionado} 
                    onChange={(e) => setJovemSelecionado(e.target.value)}
                  >
                    <option value="">Selecione um jovem...</option>
                    {jovens.map(jovem => (
                      <option key={jovem.idJovem} value={jovem.idJovem}>
                        {jovem.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button variant="primary" onClick={buscarDadosJovem}>
                    <i className="fas fa-search me-1"></i>Buscar Dados
                  </Button>
                </Col>
              </Row>
              
              {progressaoJovem && (
                <div className="dados-jovem bg-light p-3 rounded">
                  <h6>{progressaoJovem.nomeJovem}</h6>
                  <p><strong>ID:</strong> {progressaoJovem.idJovem}</p>
                  <p><strong>Total de Requisitos Cumpridos:</strong> {progressaoJovem.totalRequisitosCumpridos}</p>
                  <p><strong>Nível Atual:</strong> {progressaoJovem.nivelAtual}</p>
                  {progressaoJovem.dataNasc && (
                    <p><strong>Data de Nascimento:</strong> {progressaoJovem.dataNasc}</p>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Relatório 2: Jovens com uma Especialidade */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="fas fa-medal me-2"></i>2. Jovens que Possuem uma Especialidade</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Select 
                    value={especialidadeSelecionada} 
                    onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
                  >
                    <option value="">Selecione uma especialidade...</option>
                    {especialidades.map(esp => (
                      <option key={esp.idEspecialidade} value={esp.idEspecialidade}>
                        {esp.descricao}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button variant="primary" onClick={buscarJovensComEspecialidade}>
                    <i className="fas fa-search me-1"></i>Buscar Jovens
                  </Button>
                </Col>
              </Row>
              
              {jovensEspecialidade.length > 0 && (
                <div>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Nível Conquistado</th>
                        <th>Data da Conquista</th>
                        <th>Requisitos Completos</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jovensEspecialidade.map((jovem, index) => (
                        <tr key={index}>
                          <td>{jovem.nome}</td>
                          <td>
                            <Badge bg={jovem.nivel === 3 ? 'success' : jovem.nivel === 2 ? 'warning' : 'info'}>
                              Nível {jovem.nivel}
                            </Badge>
                          </td>
                          <td>{new Date(jovem.dataConquista).toLocaleDateString('pt-BR')}</td>
                          <td>{jovem.requisitosCompletos}/{jovem.totalRequisitos}</td>
                          <td>
                            <div className="progress">
                              <div 
                                className="progress-bar" 
                                style={{width: `${(jovem.requisitosCompletos/jovem.totalRequisitos)*100}%`}}
                              >
                                {Math.round((jovem.requisitosCompletos/jovem.totalRequisitos)*100)}%
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button 
                    variant="success" 
                    onClick={() => exportarCSV(
                      jovensEspecialidade, 
                      'jovens_especialidade.csv',
                      ['nome', 'nivel', 'dataConquista', 'requisitosCompletos', 'totalRequisitos']
                    )}
                  >
                    <i className="fas fa-download me-1"></i>Exportar CSV
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Relatório 3: Requisitos Cumpridos por um Jovem */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="fas fa-tasks me-2"></i>3. Requisitos Cumpridos por um Jovem</h5>
            </Card.Header>
            <Card.Body>
              {requisitosJovem.length > 0 && (
                <div>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Especialidade</th>
                        <th>Requisito</th>
                        <th>Data de Cumprimento</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requisitosJovem.map((req, index) => (
                        <tr key={index}>
                          <td>{req.especialidade}</td>
                          <td>{req.requisito}</td>
                          <td>{new Date(req.dataCumprimento).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <Badge bg="success">
                              <i className="fas fa-check me-1"></i>
                              {req.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button 
                    variant="success" 
                    onClick={() => exportarCSV(
                      requisitosJovem, 
                      'requisitos_jovem.csv',
                      ['especialidade', 'requisito', 'dataCumprimento', 'status']
                    )}
                  >
                    <i className="fas fa-download me-1"></i>Exportar CSV
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Relatório 4: Jovens Aptos ao Cruzeiro do Sul */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="fas fa-star me-2"></i>4. Jovens Aptos ao Cruzeiro do Sul</h5>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-info">
                <strong>Critérios para o Cruzeiro do Sul:</strong>
                <ul className="mb-0">
                  <li>Possuir o distintivo Lobo Caçador</li>
                  <li>Ter obtido no mínimo 1 insígnia de interesse especial</li>
                  <li>Ter 5 especialidades em pelo menos 3 áreas de conhecimento diferentes</li>
                  <li>Ser recomendado por um Velho Lobo</li>
                </ul>
              </div>
              
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Data de Entrada</th>
                    <th>Distintivos</th>
                    <th>Especialidades</th>
                    <th>Áreas</th>
                    <th>Insígnias</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jovensCruzeiro.map((jovem, index) => (
                    <tr key={index}>
                      <td><strong>{jovem.nome}</strong></td>
                      <td>{jovem.idade} anos</td>
                      <td>{new Date(jovem.dataEntrada).toLocaleDateString('pt-BR')}</td>
                      <td>
                        {jovem.distintivosConquistados.map((dist, i) => (
                          <Badge key={i} bg="primary" className="me-1 mb-1">
                            {dist}
                          </Badge>
                        ))}
                      </td>
                      <td>
                        <Badge bg="success">{jovem.especialidades} especialidades</Badge>
                      </td>
                      <td>
                        <Badge bg="info">{jovem.areasEspecialidades} áreas</Badge>
                      </td>
                      <td>
                        {jovem.insignias.map((ins, i) => (
                          <Badge key={i} bg="warning" className="me-1">
                            {ins}
                          </Badge>
                        ))}
                      </td>
                      <td>
                        <Badge bg={jovem.status === 'Apto' ? 'success' : 'warning'}>
                          {jovem.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <Button 
                variant="success" 
                onClick={() => exportarCSV(
                  jovensCruzeiro, 
                  'jovens_cruzeiro_do_sul.csv',
                  ['nome', 'idade', 'dataEntrada', 'especialidades', 'areasEspecialidades', 'status']
                )}
              >
                <i className="fas fa-download me-1"></i>Exportar CSV
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Relatorios;