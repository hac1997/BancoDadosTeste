import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function CustomNavbar() {
  const location = useLocation();

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-campground me-2"></i>
          Sistema Escoteiro - Lobinhos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              <i className="fas fa-home me-1"></i> Início
            </Nav.Link>
            <Nav.Link as={Link} to="/jovens" active={location.pathname === '/jovens'}>
              <i className="fas fa-users me-1"></i> Jovens
            </Nav.Link>
            <Nav.Link as={Link} to="/especialidades" active={location.pathname === '/especialidades'}>
              <i className="fas fa-medal me-1"></i> Especialidades
            </Nav.Link>
            <Nav.Link as={Link} to="/progressao" active={location.pathname === '/progressao'}>
              <i className="fas fa-chart-line me-1"></i> Progressão
            </Nav.Link>
            <Nav.Link as={Link} to="/relatorios" active={location.pathname === '/relatorios'}>
              <i className="fas fa-file-alt me-1"></i> Relatórios
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;