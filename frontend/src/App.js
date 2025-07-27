import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Jovens from './components/Jovens';
import Especialidades from './components/Especialidades';
import Progressao from './components/Progressao';
import Relatorios from './components/Relatorios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <div className="container-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jovens" element={<Jovens />} />
            <Route path="/especialidades" element={<Especialidades />} />
            <Route path="/progressao" element={<Progressao />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;