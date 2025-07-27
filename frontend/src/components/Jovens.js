import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { deleteJovem, fetchJovens } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Jovens.css';
import JovemModal from './JovemModal';

function Jovens() {
  const [jovens, setJovens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJovem, setSelectedJovem] = useState(null);

  useEffect(() => {
    loadJovens();
  }, []);

  const loadJovens = async () => {
    setLoading(true);
    try {
      const data = await fetchJovens();
      setJovens(data);
    } catch (error) {
      showAlert('Erro ao carregar jovens: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (jovem) => {
    if (!jovem || !jovem.idJovem) {
      console.error('Invalid jovem object:', jovem);
      return;
    }
    console.log('Editing jovem:', jovem);
    setSelectedJovem(jovem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este jovem?')) return;
    try {
      await deleteJovem(id);
      showAlert('Jovem excluído com sucesso!', 'success');
      loadJovens();
    } catch (error) {
      showAlert('Erro ao excluir jovem: ' + error.message, 'danger');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedJovem(null);
  };

  const handleNewJovem = () => {
    console.log('Opening modal for new jovem');
    setSelectedJovem({}); // Set to empty object for new jovem
    setShowModal(true);
  };

  return (
    <div id="jovens-section" className="section">
      <Container>
        <div className="section-content">
          <h2>
            <i className="fas fa-users me-2"></i>Gestão de Jovens
          </h2>

          <Row className="mb-4">
            <Col md={3}>
              <Button variant="success" onClick={handleNewJovem}>
                <i className="fas fa-plus me-1"></i>Novo Jovem
              </Button>
            </Col>
          </Row>

          {loading && (
            <div id="jovens-loading" className="loading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando jovens...</p>
            </div>
          )}

          {jovens.length > 0 && (
            <Card>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Data de Nascimento</th>
                      <th>Tipo Sanguíneo</th>
                      <th>Data de Entrada</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jovens.map((jovem) => (
                      <tr key={jovem.idJovem}>
                        <td>{jovem.nome}</td>
                        <td>{jovem.dataNasc}</td>
                        <td>{jovem.tipoSanguineo || 'N/A'}</td>
                        <td>{jovem.dataEntrada}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEdit(jovem)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(jovem.idJovem)}
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

          <JovemModal
            show={showModal}
            handleClose={handleModalClose}
            jovem={selectedJovem}
            onSave={loadJovens}
          />
        </div>
      </Container>
    </div>
  );
}

export default Jovens;