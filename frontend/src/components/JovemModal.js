import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { createJovem, updateJovem } from '../services/api';
import { showAlert } from '../utils/alert';
import '../styles/Modal.css';

function JovemModal({ show, handleClose, jovem = {}, onSave }) {
  const [formData, setFormData] = useState({
    // Dados biográficos
    idJovem: jovem?.idJovem || '',
    nome: jovem?.nome || '',
    dataNasc: jovem?.dataNasc || '',
    dataEntrada: jovem?.dataEntrada || '',
    
    // Dados de saúde
    tipoSanguineo: jovem?.tipoSanguineo || '',
    alergias: jovem?.alergias || '',
    
    // Dados de contato
    telefone: jovem?.contato?.telefone || '',
    endereco: jovem?.contato?.endereco || '',
    email: jovem?.contato?.email || '',
    
    // Dados do responsável
    nomeResponsavel: jovem?.responsavel?.nome || '',
    telefoneResponsavel: jovem?.responsavel?.telefone || '',
    emailResponsavel: jovem?.responsavel?.email || '',
  });

  useEffect(() => {
    if (jovem && Object.keys(jovem).length > 0) {
      setFormData({
        idJovem: jovem.idJovem || '',
        nome: jovem.nome || '',
        dataNasc: jovem.dataNasc || '',
        dataEntrada: jovem.dataEntrada || '',
        tipoSanguineo: jovem.tipoSanguineo || '',
        alergias: jovem.alergias || '',
        telefone: jovem.contato?.telefone || '',
        endereco: jovem.contato?.endereco || '',
        email: jovem.contato?.email || '',
        nomeResponsavel: jovem.responsavel?.nome || '',
        telefoneResponsavel: jovem.responsavel?.telefone || '',
        emailResponsavel: jovem.responsavel?.email || '',
      });
    }
  }, [jovem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.dataNasc || !formData.dataEntrada) {
      showAlert('Preencha todos os campos obrigatórios (nome, data de nascimento e data de entrada)', 'warning');
      return;
    }
    
    try {
      const jovemData = {
        nome: formData.nome,
        dataNasc: formData.dataNasc,
        dataEntrada: formData.dataEntrada,
        tipoSanguineo: formData.tipoSanguineo,
        alergias: formData.alergias,
        contato: {
          telefone: formData.telefone,
          endereco: formData.endereco,
          email: formData.email,
        },
        responsavel: {
          nome: formData.nomeResponsavel,
          telefone: formData.telefoneResponsavel,
          email: formData.emailResponsavel,
        }
      };

      if (formData.idJovem) {
        await updateJovem(formData.idJovem, jovemData);
        showAlert('Jovem atualizado com sucesso!', 'success');
      } else {
        await createJovem(jovemData);
        showAlert('Jovem cadastrado com sucesso!', 'success');
      }
      onSave();
      handleClose();
    } catch (error) {
      showAlert('Erro ao salvar jovem: ' + error.message, 'danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-paw me-2"></i>
          {formData.idJovem ? 'Editar Jovem Lobinho' : 'Novo Jovem Lobinho'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="biograficos" id="jovem-tabs">
          <Tab eventKey="biograficos" title={<><i className="fas fa-user me-1"></i>Dados Biográficos</>}>
            <div className="mt-3">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome completo do jovem"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataNasc"
                      value={formData.dataNasc}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Entrada no Grupo *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataEntrada"
                      value={formData.dataEntrada}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo Sanguíneo</Form.Label>
                    <Form.Select
                      name="tipoSanguineo"
                      value={formData.tipoSanguineo}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o tipo sanguíneo</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Alergias e Observações Médicas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Descreva alergias, medicamentos em uso, ou outras observações médicas importantes"
                />
              </Form.Group>
            </div>
          </Tab>
          
          <Tab eventKey="contato" title={<><i className="fas fa-phone me-1"></i>Contato</>}>
            <div className="mt-3">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Endereço Completo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade, CEP"
                />
              </Form.Group>
            </div>
          </Tab>
          
          <Tab eventKey="responsavel" title={<><i className="fas fa-user-shield me-1"></i>Responsável</>}>
            <div className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Nome do Responsável</Form.Label>
                <Form.Control
                  type="text"
                  name="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome completo do responsável"
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone do Responsável</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-mail do Responsável</Form.Label>
                    <Form.Control
                      type="email"
                      name="emailResponsavel"
                      value={formData.emailResponsavel}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="fas fa-times me-1"></i>Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="fas fa-save me-1"></i>Salvar Jovem Lobinho
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default JovemModal;