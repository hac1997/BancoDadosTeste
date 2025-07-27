-- Criação do banco de dados
DROP DATABASE IF EXISTS bcd;
CREATE DATABASE bcd;
USE bcd;

-- Tabela area_conhecimento
CREATE TABLE area_conhecimento (
    id_area_conhecimento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

-- Tabela contato
CREATE TABLE contato (
    id_contato INT PRIMARY KEY AUTO_INCREMENT,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Tabela responsaveis
CREATE TABLE responsaveis (
    id_responsavel INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

-- Tabela jovem
CREATE TABLE jovem (
    id_jovem INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_nasc DATE NOT NULL,
    data_entrada DATE NOT NULL,
    tipo_sanguineo VARCHAR(10) NOT NULL,
    alergias TEXT NOT NULL,
    id_contato INT NOT NULL,
    FOREIGN KEY (id_contato) REFERENCES contato(id_contato)
);

-- Tabela especialidade
CREATE TABLE especialidade (
    id_especialidade INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    nivel INT NOT NULL CHECK (nivel IN (1, 2, 3)),
    total_requisitos INT NOT NULL,
    id_area_conhecimento INT NOT NULL,
    FOREIGN KEY (id_area_conhecimento) REFERENCES area_conhecimento(id_area_conhecimento)
);

-- Tabela distintivos_de_progressao
CREATE TABLE distintivos_de_progressao (
    id_distintivo INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

-- Tabela requisitos_insignia
CREATE TABLE requisitos_insignia (
    id_requisito_insignia INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

-- Tabela requisito_especialidade
CREATE TABLE requisito_especialidade (
    id_requisito INT PRIMARY KEY AUTO_INCREMENT,
    requisito TEXT NOT NULL
);

-- Tabela requisito_distintivo
CREATE TABLE requisito_distintivo (
    id_requisito_distintivo INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL
);

-- Tabela insignia
CREATE TABLE insignia (
    id_insignia INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- Tabela atividade
CREATE TABLE atividade (
    id_atividade INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    data_atividade DATE NOT NULL
);

-- Tabela jovem_responsavel (N:N)
CREATE TABLE jovem_responsavel (
    id_jovem INT NOT NULL,
    id_responsavel INT NOT NULL,
    PRIMARY KEY (id_jovem, id_responsavel),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem),
    FOREIGN KEY (id_responsavel) REFERENCES responsaveis(id_responsavel)
);

-- Tabela e_requisito_especialidade (N:N)
CREATE TABLE e_requisito_especialidade (
    id_especialidade INT NOT NULL,
    id_requisito INT NOT NULL,
    PRIMARY KEY (id_especialidade, id_requisito),
    FOREIGN KEY (id_especialidade) REFERENCES especialidade(id_especialidade),
    FOREIGN KEY (id_requisito) REFERENCES requisito_especialidade(id_requisito)
);

-- Tabela e_requisito_insignia (N:N)
CREATE TABLE e_requisito_insignia (
    id_insignia INT NOT NULL,
    id_requisito_insignia INT NOT NULL,
    PRIMARY KEY (id_insignia, id_requisito_insignia),
    FOREIGN KEY (id_insignia) REFERENCES insignia(id_insignia),
    FOREIGN KEY (id_requisito_insignia) REFERENCES requisitos_insignia(id_requisito_insignia)
);

-- Tabela insignia_jovem (N:N)
CREATE TABLE insignia_jovem (
    id_jovem INT NOT NULL,
    id_insignia INT NOT NULL,
    data_conquista DATE NOT NULL,
    PRIMARY KEY (id_jovem, id_insignia),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem),
    FOREIGN KEY (id_insignia) REFERENCES insignia(id_insignia)
);

-- Tabela prog_requisito (N:N)
CREATE TABLE prog_requisito (
    id_distintivo INT NOT NULL,
    id_requisito_distintivo INT NOT NULL,
    PRIMARY KEY (id_distintivo, id_requisito_distintivo),
    FOREIGN KEY (id_distintivo) REFERENCES distintivos_de_progressao(id_distintivo),
    FOREIGN KEY (id_requisito_distintivo) REFERENCES requisito_distintivo(id_requisito_distintivo)
);

-- Tabela distintivo_jovem (N:N)
CREATE TABLE distintivo_jovem (
    id_distintivo INT NOT NULL,
    id_jovem INT NOT NULL,
    data_conquista DATE NOT NULL,
    PRIMARY KEY (id_distintivo, id_jovem),
    FOREIGN KEY (id_distintivo) REFERENCES distintivos_de_progressao(id_distintivo),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem)
);

-- Tabela participacao_atividade (N:N)
CREATE TABLE participacao_atividade (
    id_atividade INT NOT NULL,
    id_jovem INT NOT NULL,
    PRIMARY KEY (id_atividade, id_jovem),
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem)
);

-- Tabela jovem_especialidade (N:N)
CREATE TABLE jovem_especialidade (
    id_jovem INT NOT NULL,
    id_especialidade INT NOT NULL,
    data_conquista DATE NOT NULL,
    PRIMARY KEY (id_jovem, id_especialidade),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem),
    FOREIGN KEY (id_especialidade) REFERENCES especialidade(id_especialidade)
);

-- Tabela jovem_requisito_especialidade (N:N)
CREATE TABLE jovem_requisito_especialidade (
    id_jovem INT NOT NULL,
    id_requisito INT NOT NULL,
    data_cumprimento DATE NOT NULL,
    PRIMARY KEY (id_jovem, id_requisito),
    FOREIGN KEY (id_jovem) REFERENCES jovem(id_jovem),
    FOREIGN KEY (id_requisito) REFERENCES requisito_especialidade(id_requisito)
);

-- Dados de exemplo (DML)
INSERT INTO area_conhecimento (nome) VALUES
('Ciência e Tecnologia'),
('Cultura'),
('Desportos'),
('Habilidades Escoteiras'),
('Serviços');

INSERT INTO contato (telefone, endereco, email) VALUES
('48999990000', 'Rua das Acácias, 100', 'joao@email.com'),
('48988881111', 'Rua das Palmeiras, 200', 'maria@email.com');

INSERT INTO responsaveis (nome, email, telefone) VALUES
('Carlos Silva', 'carlos@email.com', '48991234567'),
('Ana Souza', 'ana@email.com', '48997654321');

INSERT INTO jovem (nome, data_nasc, data_entrada, tipo_sanguineo, alergias, id_contato) VALUES
('João Lobinho', '2015-04-20', '2022-01-15', 'O+', 'Nenhuma', 1),
('Maria Escoteira', '2014-09-10', '2021-09-01', 'A-', 'Alergia a amendoim', 2);

INSERT INTO especialidade (descricao, nivel, total_requisitos, id_area_conhecimento) VALUES
('Radioamadorismo', 1, 12, 1),
('Criptografia', 1, 12, 1),
('Animais Peçonhentos', 1, 9, 1);

INSERT INTO distintivos_de_progressao (descricao) VALUES
('Lobo Pata Tenra'),
('Lobo Saltador'),
('Lobo Rastreador'),
('Lobo Caçador'),
('Cruzeiro do Sul');

INSERT INTO insignia (nome) VALUES
('Aprender'),
('Servir');

INSERT INTO atividade (descricao, data_atividade) VALUES
('Acampamento inicial', '2023-05-15'),
('Curso de Radioamadorismo', '2023-07-10');

INSERT INTO jovem_responsavel (id_jovem, id_responsavel) VALUES
(1, 1),
(2, 2);

INSERT INTO distintivo_jovem (id_distintivo, id_jovem, data_conquista) VALUES
(4, 1, '2024-08-15');

INSERT INTO insignia_jovem (id_jovem, id_insignia, data_conquista) VALUES
(1, 1, '2024-09-01'),
(1, 2, '2024-10-01');

INSERT INTO participacao_atividade (id_atividade, id_jovem) VALUES
(1, 1),
(2, 1);

INSERT INTO requisito_especialidade (requisito) VALUES
('Montar antena básica'),
('Fazer transmissão'),
('Decifrar código simples');

INSERT INTO e_requisito_especialidade (id_especialidade, id_requisito) VALUES
(1, 1),
(1, 2),
(2, 3);

INSERT INTO jovem_especialidade (id_jovem, id_especialidade, data_conquista) VALUES
(1, 1, '2024-09-15'),
(1, 2, '2024-10-15');

INSERT INTO jovem_requisito_especialidade (id_jovem, id_requisito, data_cumprimento) VALUES
(1, 1, '2024-08-01'),
(1, 2, '2024-08-10'),
(1, 3, '2024-09-05');

-- Novos contatos (Jovens 3, 4, 5)
INSERT INTO contato (telefone, endereco, email) VALUES
('48991112222', 'Rua do Carvalho, 300', 'lucas@email.com'),
('48992223333', 'Av. das Araucárias, 400', 'sofia@email.com'),
('48993334444', 'Rua das Hortênsias, 500', 'enrico@email.com');

-- Novos responsáveis (Jovens 3, 4, 5)
INSERT INTO responsaveis (nome, email, telefone) VALUES
('Fernando Lima', 'fernando@email.com', '48995556666'),
('Paula Mendes', 'paula@email.com', '48996667777'),
('Ricardo Torres', 'ricardo@email.com', '48997778888');

-- Novos jovens (Jovens 3, 4, 5)
INSERT INTO jovem (nome, data_nasc, data_entrada, tipo_sanguineo, alergias, id_contato) VALUES
('Lucas Aventureiro', '2015-11-30', '2023-03-12', 'B+', 'Nenhuma', 3),
('Sofia Exploradora', '2013-06-22', '2022-05-18', 'AB-', 'Poeira', 4),
('Enrico Valente', '2014-02-17', '2022-08-25', 'O-', 'Alergia a frutos do mar', 5);

-- jovem_responsavel (associação dos novos jovens com responsáveis)
INSERT INTO jovem_responsavel (id_jovem, id_responsavel) VALUES
(3, 3),  -- Lucas - Fernando
(4, 4),  -- Sofia - Paula
(5, 5);  -- Enrico - Ricardo

-- Distintivos para novos jovens
INSERT INTO distintivo_jovem (id_distintivo, id_jovem, data_conquista) VALUES
(2, 3, '2024-05-12'),
(3, 4, '2024-06-20'),
(1, 5, '2024-07-05');

-- Insígnias conquistadas
INSERT INTO insignia_jovem (id_jovem, id_insignia, data_conquista) VALUES
(3, 1, '2024-08-10'),
(4, 2, '2024-08-20'),
(5, 1, '2024-09-01');

-- Participação em atividades
INSERT INTO participacao_atividade (id_atividade, id_jovem) VALUES
(1, 3),
(2, 4),
(2, 5);

-- Novos Requisitos de Especialidade (opcional)
INSERT INTO requisito_especialidade (requisito) VALUES
('Reconhecer sinais de rádio'),
('Criptografar mensagem com chave simétrica');

-- Relacionar com especialidades
INSERT INTO e_requisito_especialidade (id_especialidade, id_requisito) VALUES
(1, 4),
(2, 5);

-- Jovens conquistando especialidades
INSERT INTO jovem_especialidade (id_jovem, id_especialidade, data_conquista) VALUES
(3, 1, '2024-11-10'),
(4, 2, '2024-11-20'),
(5, 3, '2024-11-25');

-- Jovens cumprindo requisitos
INSERT INTO jovem_requisito_especialidade (id_jovem, id_requisito, data_cumprimento) VALUES
(3, 1, '2024-09-01'),
(3, 2, '2024-09-05'),
(4, 3, '2024-09-15'),
(4, 5, '2024-09-20'),
(5, 1, '2024-09-25');

-- =================================================================
-- INSERÇÕES ADICIONAIS PARA COMPLETAR 10 JOVENS
-- =================================================================

-- Novos contatos (Jovens 6, 7, 8, 9, 10)
INSERT INTO contato (telefone, endereco, email) VALUES
('48981234567', 'Rua dos Pinheiros, 600', 'beatriz@email.com'),
('48982345678', 'Av. Central, 700', 'gabriel@email.com'),
('48983456789', 'Travessa das Flores, 800', 'laura@email.com'),
('48984567890', 'Alameda dos Sabiás, 900', 'miguel@email.com'),
('48985678901', 'Rua da Lagoa, 1010', 'helena@email.com');

-- Novos responsáveis (Jovens 6, 7, 8, 9, 10)
INSERT INTO responsaveis (nome, email, telefone) VALUES
('Marcia Rocha', 'marcia@email.com', '48988889999'),
('Julio Cesar', 'julio@email.com', '48987776666'),
('Vanessa Borges', 'vanessa@email.com', '48986665555'),
('André Pereira', 'andre@email.com', '48985554444'),
('Sandra Dias', 'sandra@email.com', '48984443333');

-- Novos jovens (Jovens 6, 7, 8, 9, 10)
INSERT INTO jovem (nome, data_nasc, data_entrada, tipo_sanguineo, alergias, id_contato) VALUES
('Beatriz Corajosa', '2016-01-15', '2023-02-20', 'A+', 'Pólen', 6),
('Gabriel Pioneiro', '2015-07-25', '2023-04-10', 'B-', 'Nenhuma', 7),
('Laura Intrépida', '2014-03-05', '2022-10-01', 'O+', 'Lactose', 8),
('Miguel Veloz', '2013-08-19', '2022-11-15', 'AB+', 'Nenhuma', 9),
('Helena Sábia', '2015-12-01', '2023-06-30', 'A-', 'Gatos', 10);

-- jovem_responsavel (associação dos novos jovens com responsáveis)
INSERT INTO jovem_responsavel (id_jovem, id_responsavel) VALUES
(6, 6),  -- Beatriz - Marcia
(7, 7),  -- Gabriel - Julio
(8, 8),  -- Laura - Vanessa
(9, 9),  -- Miguel - André
(10, 10); -- Helena - Sandra

-- Distintivos para novos jovens
INSERT INTO distintivo_jovem (id_distintivo, id_jovem, data_conquista) VALUES
(1, 6, '2024-03-15'),
(2, 7, '2024-04-22'),
(3, 8, '2024-05-30'),
(4, 9, '2024-06-18'),
(1, 10, '2024-07-25');

-- Insígnias conquistadas
INSERT INTO insignia_jovem (id_jovem, id_insignia, data_conquista) VALUES
(6, 2, '2024-09-10'),
(7, 1, '2024-09-15'),
(8, 2, '2024-10-05'),
(9, 1, '2024-10-20'),
(10, 2, '2024-11-01');

-- Participação em atividades
INSERT INTO participacao_atividade (id_atividade, id_jovem) VALUES
(1, 6),
(1, 7),
(2, 8),
(1, 9),
(2, 10);

-- Jovens conquistando especialidades
INSERT INTO jovem_especialidade (id_jovem, id_especialidade, data_conquista) VALUES
(6, 3, '2024-12-01'),
(7, 1, '2024-12-05'),
(8, 2, '2024-12-10'),
(9, 1, '2024-12-15'),
(10, 3, '2024-12-20');

-- Jovens cumprindo requisitos
INSERT INTO jovem_requisito_especialidade (id_jovem, id_requisito, data_cumprimento) VALUES
(6, 1, '2024-10-01'),
(7, 2, '2024-10-05'),
(8, 3, '2024-10-15'),
(9, 4, '2024-10-20'),
(10, 5, '2024-10-25');

-- =================================================================
-- NOVAS ESPECIALIDADES E REQUISITOS
-- =================================================================

-- Novas especialidades
INSERT INTO especialidade (descricao, nivel, total_requisitos, id_area_conhecimento) VALUES
('Culinária', 1, 3, 2),          -- id_especialidade = 4 (Cultura)
('Primeiros Socorros', 1, 3, 5), -- id_especialidade = 5 (Serviços)
('Natação', 1, 3, 3),            -- id_especialidade = 6 (Desportos)
('Orientação', 1, 3, 4),         -- id_especialidade = 7 (Habilidades Escoteiras)
('Fotografia', 1, 3, 2),         -- id_especialidade = 8 (Cultura)
('Mecânica de Bicicleta', 1, 3, 1);-- id_especialidade = 9 (Ciência e Tecnologia)

-- Novos requisitos para as especialidades acima
INSERT INTO requisito_especialidade (requisito) VALUES
('Preparar uma refeição de 3 pratos'),           -- id_requisito = 6
('Demonstrar técnicas de corte seguras'),        -- id_requisito = 7
('Cozer pão a partir do zero'),                  -- id_requisito = 8
('Tratar de um corte ou arranhão'),              -- id_requisito = 9
('Realizar a manobra de Heimlich'),              -- id_requisito = 10
('Reconhecer sinais de insolação'),              -- id_requisito = 11
('Nadar 100 metros continuamente'),              -- id_requisito = 12
('Demonstrar 3 estilos de nado diferentes'),     -- id_requisito = 13
('Realizar um salvamento básico'),               -- id_requisito = 14
('Ler um mapa topográfico'),                     -- id_requisito = 15
('Usar uma bússola para encontrar o norte'),     -- id_requisito = 16
('Completar um percurso de orientação'),         -- id_requisito = 17
('Explicar abertura, velocidade do obturador e ISO'),-- id_requisito = 18
('Tirar um retrato bem composto'),              -- id_requisito = 19
('Editar uma fotografia usando software'),       -- id_requisito = 20
('Remendar um pneu furado'),                     -- id_requisito = 21
('Ajustar os travões'),                          -- id_requisito = 22
('Limpar e lubrificar a corrente');              -- id_requisito = 23

-- Associar requisitos às novas especialidades
INSERT INTO e_requisito_especialidade (id_especialidade, id_requisito) VALUES
-- Culinária (id 4)
(4, 6), (4, 7), (4, 8),
-- Primeiros Socorros (id 5)
(5, 9), (5, 10), (5, 11),
-- Natação (id 6)
(6, 12), (6, 13), (6, 14),
-- Orientação (id 7)
(7, 15), (7, 16), (7, 17),
-- Fotografia (id 8)
(8, 18), (8, 19), (8, 20),
-- Mecânica de Bicicleta (id 9)
(9, 21), (9, 22), (9, 23);

-- =================================================================
-- ASSOCIAR NOVAS ESPECIALIDADES E REQUISITOS AOS JOVENS
-- =================================================================

-- Jovens conquistando as novas especialidades
INSERT INTO jovem_especialidade (id_jovem, id_especialidade, data_conquista) VALUES
(2, 5, '2025-01-10'), -- Maria Escoteira conquista Primeiros Socorros
(4, 4, '2025-01-15'), -- Sofia Exploradora conquista Culinária
(7, 7, '2025-01-20'), -- Gabriel Pioneiro conquista Orientação
(8, 8, '2025-01-25'), -- Laura Intrépida conquista Fotografia
(9, 9, '2025-02-01'); -- Miguel Veloz conquista Mecânica de Bicicleta

-- Jovens cumprindo os novos requisitos
INSERT INTO jovem_requisito_especialidade (id_jovem, id_requisito, data_cumprimento) VALUES
-- Maria Escoteira (Primeiros Socorros)
(2, 9, '2024-12-01'),
(2, 10, '2024-12-15'),
(2, 11, '2025-01-05'),
-- Sofia Exploradora (Culinária)
(4, 6, '2024-12-05'),
(4, 7, '2024-12-20'),
(4, 8, '2025-01-10'),
-- Gabriel Pioneiro (Orientação)
(7, 15, '2024-12-10'),
(7, 16, '2024-12-25'),
(7, 17, '2025-01-18'),
-- Laura Intrépida (Fotografia)
(8, 18, '2024-12-12'),
(8, 19, '2024-12-28'),
(8, 20, '2025-01-22'),
-- Miguel Veloz (Mecânica de Bicicleta)
(9, 21, '2025-01-10'),
(9, 22, '2025-01-20'),
(9, 23, '2025-01-28');


-- Associação entre especialidades e seus requisitos
INSERT INTO e_requisito_especialidade (id_especialidade, id_requisito) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 5),
(4, 2),
(4, 6);

-- Conquistas de especialidades por jovens
INSERT INTO jovem_especialidade (id_jovem, id_especialidade, data_conquista) VALUES
(1, 1, '2024-09-15'),
(1, 2, '2024-10-15'),
(2, 1, '2024-07-20'),
(2, 3, '2024-08-30'),
(3, 2, '2024-09-10'),
(3, 4, '2024-11-01');

-- Cumprimento de requisitos por jovens
INSERT INTO jovem_requisito_especialidade (id_jovem, id_requisito, data_cumprimento) VALUES
(1, 1, '2024-08-01'),
(1, 2, '2024-08-10'),
(1, 3, '2024-09-05'),
(2, 1, '2024-07-01'),
(2, 2, '2024-07-10'),
(2, 5, '2024-08-15'),
(3, 3, '2024-09-01'),
(3, 4, '2024-09-05'),
(3, 6, '2024-10-20');
