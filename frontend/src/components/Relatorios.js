import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { showAlert } from '../utils/alert';
import '../styles/Relatorios.css';

function Relatorios() {
  const [estatisticasGerais, setEstatisticasGerais] = useState({});
  const [jovensPorNivel, setJovensPorNivel] = useState({});
  const [especialidadesPopulares, setEspecialidadesPopulares] = useState([]);
  const [progressaoPorArea, setProgressaoPorArea] = useState([]);
  const [jovensInativos, setJovensInativos] = useState([]);
  const [rankingProgressao, setRankingProgressao] = useState([]);

  useEffect(() => {
    fetchRelatorios();
  }, []);

  const fetchRelatorios = async () => {
    try {
      const [estatisticas, nivel, populares, area, inativos, ranking] = await Promise.all([
        fetch('/api/relatorios/estatisticas-gerais').then(res => res.json()),
        fetch('/api/relatorios/jovens-por-nivel').then(res => res.json()),
        fetch('/api/relatorios/especialidades-populares').then(res => res.json()),
        fetch('/api/relatorios/progressao-por-area').then(res => res.json()),
        fetch('/api/relatorios/jovens-inativos').then(res => res.json()),
        fetch('/api/relatorios/ranking-progressao').then(res => res.json()),
      ]);
      setEstatisticasGerais(estatisticas);
      setJovensPorNivel(nivel);
      setEspecialidadesPopulares(populares);
      setProgressaoPorArea(area);
      setJovensInativos(inativos);
      setRankingProgressao(ranking);
    } catch (error) {
      showAlert('Erro ao carregar relatórios', 'danger');
    }
  };

  const exportToCSV = (data, filename, headers) => {
    const csv = [
      headers.join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };

  return (
    <div id="relatorios-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-chart-bar me-2"></i>Relatórios
          </h2>

          <Card className="mb-4">
            <Card.Header>Estatísticas Gerais</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <tbody>
                  <tr><td>Total de Jovens</td><td>{estatisticasGerais.totalJovens}</td></tr>
                  <tr><td>Total de Especialidades</td><td>{estatisticasGerais.totalEspecialidades}</td></tr>
                  <tr><td>Total de Requisitos Completos</td><td>{estatisticasGerais.totalRequisitosCompletos}</td></tr>
                  <tr><td>Jovens Aptos ao Cruzeiro do Sul</td><td>{estatisticasGerais.jovensAptosCruzeiro}</td></tr>
                  <tr><td>Média de Idade</td><td>{estatisticasGerais.mediaIdade}</td></tr>
                  <tr><td>Média de Requisitos por Jovem</td><td>{estatisticasGerais.mediaRequisitosPorJovem}</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Jovens por Nível</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nível</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Iniciantes</td><td>{jovensPorNivel.contadores?.iniciantes}</td></tr>
                  <tr><td>Intermediários</td><td>{jovensPorNivel.contadores?.intermediarios}</td></tr>
                  <tr><td>Avançados</td><td>{jovensPorNivel.contadores?.avancados}</td></tr>
                  <tr><td>Especialistas</td><td>{jovensPorNivel.contadores?.especialistas}</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Especialidades Populares</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Especialidade</th>
                    <th>Nível</th>
                    <th>Área de Conhecimento</th>
                    <th>Jovens Participantes</th>
                    <th>Total de Requisitos</th>
                  </tr>
                </thead>
                <tbody>
                  {especialidadesPopulares.map((esp, index) => (
                    <tr key={index}>
                      <td>{esp.especialidade}</td>
                      <td>{esp.nivel}</td>
                      <td>{esp.areaConhecimento}</td>
                      <td>{esp.jovensParticipantes}</td>
                      <td>{esp.totalRequisitos}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => exportToCSV(especialidadesPopulares, 'especialidades_populares.csv', [
                'especialidade', 'nivel', 'areaConhecimento', 'jovensParticipantes', 'totalRequisitos'
              ])}>
                Exportar CSV
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Progressão por Área</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Área de Conhecimento</th>
                    <th>Total de Especialidades</th>
                    <th>Total de Requisitos</th>
                    <th>Requisitos Completos</th>
                    <th>Percentual Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {progressaoPorArea.map((area, index) => (
                    <tr key={index}>
                      <td>{area.areaConhecimento}</td>
                      <td>{area.totalEspecialidades}</td>
                      <td>{area.totalRequisitos}</td>
                      <td>{area.requisitosCompletos}</td>
                      <td>{area.percentualCompleto}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => exportToCSV(progressaoPorArea, 'progressao_por_area.csv', [
                'areaConhecimento', 'totalEspecialidades', 'totalRequisitos', 'requisitosCompletos', 'percentualCompleto'
              ])}>
                Exportar CSV
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Jovens Inativos</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data de Entrada</th>
                    <th>Total de Requisitos</th>
                    <th>Última Atividade</th>
                  </tr>
                </thead>
                <tbody>
                  {jovensInativos.map((jovem, index) => (
                    <tr key={index}>
                      <td>{jovem.nome}</td>
                      <td>{jovem.dataEntrada}</td>
                      <td>{jovem.totalRequisitos}</td>
                      <td>{jovem.ultimaAtividade || 'Nenhuma'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => exportToCSV(jovensInativos, 'jovens_inativos.csv', [
                'nome', 'dataEntrada', 'totalRequisitos', 'ultimaAtividade'
              ])}>
                Exportar CSV
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Ranking de Progressão</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Nome</th>
                    <th>Total de Requisitos</th>
                    <th>Especialidades Completas</th>
                    <th>Especialidades em Progresso</th>
                    <th>Data de Entrada</th>
                    <th>Pontuação</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingProgressao.map((jovem, index) => (
                    <tr key={index}>
                      <td>{jovem.posicao}</td>
                      <td>{jovem.nome}</td>
                      <td>{jovem.totalRequisitos}</td>
                      <td>{jovem.especialidadesCompletas}</td>
                      <td>{jovem.especialidadesEmProgresso}</td>
                      <td>{jovem.dataEntrada}</td>
                      <td>{jovem.pontuacao}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => exportToCSV(rankingProgressao, 'ranking_progressao.csv', [
                'posicao', 'nome', 'totalRequisitos', 'especialidadesCompletas', 'especialidadesEmProgresso', 'dataEntrada', 'pontuacao'
              ])}>
                Exportar CSV
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Relatorios;