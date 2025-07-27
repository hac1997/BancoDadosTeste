import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Mesma base URL do api.js original
});

export const fetchStats = async () => {
  try {
    const [jovensResponse, especialidadesResponse] = await Promise.all([
      api.get('/jovens'),
      api.get('/especialidades'),
    ]);
    return {
      totalJovens: jovensResponse.data.length,
      totalEspecialidades: especialidadesResponse.data.length,
      totalRequisitos: jovensResponse.data.length * 5, // Simulação conforme api.js
      jovensCruzeiro: Math.floor(jovensResponse.data.length * 0.1), // Simulação
    };
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    throw error;
  }
};

export const fetchJovens = async ({ search = '', tipoSanguineo = '' } = {}) => {
  try {
    const response = await api.get('jovens', {
      params: { search, tipoSanguineo },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar jovens:', error);
    throw error;
  }
};

export const createJovem = async (jovemData) => {
  try {
    const response = await api.post('/jovens', jovemData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar jovem:', error);
    throw error;
  }
};

export const updateJovem = async (id, jovemData) => {
  try {
    const response = await api.put(`/jovens/${id}`, jovemData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar jovem:', error);
    throw error;
  }
};

export const deleteJovem = async (id) => {
  try {
    await api.delete(`/jovens/${id}`);
  } catch (error) {
    console.error('Erro ao excluir jovem:', error);
    throw error;
  }
};

export const fetchEspecialidades = async ({ nivel = '' } = {}) => {
  try {
    const response = await api.get('/especialidades', {
      params: { nivel },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar especialidades:', error);
    throw error;
  }
};

export const createEspecialidade = async (especialidadeData) => {
  try {
    const response = await api.post('/especialidades', especialidadeData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    throw error;
  }
};

export const updateEspecialidade = async (id, especialidadeData) => {
  try {
    const response = await api.put(`/especialidades/${id}`, especialidadeData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar especialidade:', error);
    throw error;
  }
};

export const deleteEspecialidade = async (id) => {
  try {
    await api.delete(`/especialidades/${id}`);
  } catch (error) {
    console.error('Erro ao excluir especialidade:', error);
    throw error;
  }
};

export const fetchJovensForSelect = async () => {
  try {
    const response = await api.get('/jovens');
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar jovens para select:', error);
    throw error;
  }
};


export const fetchProgressaoJovem = async (jovemId) => {
  try {
    const response = await api.get(`/progressao/jovem/${jovemId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar progressão:', error);
    throw error;
  }
};



export const registrarRequisito = async (requisitoData) => {
  try {
    const response = await api.post('/progressao/requisito', requisitoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar requisito:', error);
    throw error;
  }
};

export const fetchRelatoriosCruzeiroDoSul = async () => {
  try {
    const response = await api.get('/progressao/cruzeiro-do-sul');
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar relatório Cruzeiro do Sul:', error);
    throw error;
  }
};



export const fetchRelatorioJovensPorNivel = async () => {
  try {
    const response = await api.get('/relatorios/jovens-por-nivel');
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar relatório de jovens por nível:', error);
    throw error;
  }
};

export const fetchRelatorioRankingProgressao = async () => {
  try {
    const response = await api.get('/relatorios/ranking-progressao');
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar ranking de progressão:', error);
    throw error;
  }
};





export const fetchRequisitosPorEspecialidade = async (especialidadeId) => {
  const response = await fetch(`/api/requisitos/especialidade/${especialidadeId}`);
  if (!response.ok) throw new Error('Erro ao carregar requisitos');
  return response.json();
};

export const createRequisito = async (requisitoData) => {
  const response = await fetch('/api/requisitos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requisito: requisitoData.requisito,
      especialidades: requisitoData.especialidades,
    }),
  });
  if (!response.ok) throw new Error('Erro ao criar requisito');
  return response.json();
};

export const updateRequisito = async (idRequisito, requisitoData) => {
  const response = await fetch(`/api/requisitos/${idRequisito}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requisito: requisitoData.requisito,
      especialidades: requisitoData.especialidades,
    }),
  });
  if (!response.ok) throw new Error('Erro ao atualizar requisito');
  return response.json();
};

export const deleteRequisito = async (idRequisito) => {
  const response = await fetch(`/api/requisitos/${idRequisito}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao excluir requisito');
};

export const fetchEspecialidadesForSelect = async () => {
  const response = await fetch('/api/especialidades/select');
  if (!response.ok) throw new Error('Erro ao carregar especialidades');
  return response.json();
};

export const fetchEstatisticasGerais = async () => {
  const response = await fetch('/api/relatorios/estatisticas-gerais');
  if (!response.ok) throw new Error('Erro ao carregar estatísticas gerais');
  return response.json();
};

export const fetchJovensPorNivel = async () => {
  const response = await fetch('/api/relatorios/jovens-por-nivel');
  if (!response.ok) throw new Error('Erro ao carregar jovens por nível');
  return response.json();
};

export const fetchEspecialidadesPopulares = async () => {
  const response = await fetch('/api/relatorios/especialidades-populares');
  if (!response.ok) throw new Error('Erro ao carregar especialidades populares');
  return response.json();
};

export const fetchProgressaoPorArea = async () => {
  const response = await fetch('/api/relatorios/progressao-por-area');
  if (!response.ok) throw new Error('Erro ao carregar progressão por área');
  return response.json();
};

export const fetchJovensInativos = async () => {
  const response = await fetch('/api/relatorios/jovens-inativos');
  if (!response.ok) throw new Error('Erro ao carregar jovens inativos');
  return response.json();
};

export const fetchRankingProgressao = async () => {
  const response = await fetch('/api/relatorios/ranking-progressao');
  if (!response.ok) throw new Error('Erro ao carregar ranking de progressão');
  return response.json();
};