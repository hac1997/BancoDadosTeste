# Trabalho - Banco de Dados
Aluno: Herick

## Para rodar a aplicação

1) Depois que você clonar a aplicação, vá na raiz do diretório e faça o seguinte comando:
```bash
docker compose up -d
```
2) Conecte-se ao banco de dados pela IDE

3) No terminal ffaça o seguinte comandp:

```bash
gradlew bootrun
```
4) No browser abra a página localhost:8080

## Estrutura do src

```bash
.
└── main
    ├── java
    │   └── ads
    │       └── bcd
    │           ├── Application.java
    │           ├── controller
    │           │   ├── EspecialidadeController.java
    │           │   ├── JovemController.java
    │           │   ├── ProgressaoController.java
    │           │   └── RelatorioController.java
    │           ├── dto
    │           │   ├── AreaConhecimentoDTO.java
    │           │   ├── EspecialidadeDTO.java
    │           │   ├── EspecialidadeProgressaoDTO.java
    │           │   ├── JovemCruzeiroAptoDTO.java
    │           │   ├── JovemDTO.java
    │           │   ├── JovemRequisitoEspecialidadeDTO.java
    │           │   ├── ProgressaoJovemDTO.java
    │           │   ├── RequisitoEspecialidadeDTO.java
    │           │   └── RequisitoProgressaoDTO.java
    │           ├── model
    │           │   ├── AreaConhecimento.java
    │           │   ├── Atividade.java
    │           │   ├── Contato.java
    │           │   ├── DistintivosDeProgressao.java
    │           │   ├── Especialidade.java
    │           │   ├── Insignia.java
    │           │   ├── Jovem.java
    │           │   ├── JovemRequisitoEspecialidade.java
    │           │   ├── JovemRequisitoEspecialidadeId.java
    │           │   ├── RequisitoDistintivo.java
    │           │   ├── RequisitoEspecialidade.java
    │           │   ├── RequisitosInsignia.java
    │           │   └── Responsaveis.java
    │           ├── repository
    │           │   ├── AreaConhecimentoRepository.java
    │           │   ├── AtividadeRepository.java
    │           │   ├── ContatoRepository.java
    │           │   ├── DistintivosDeProgressaoRepository.java
    │           │   ├── EspecialidadeRepository.java
    │           │   ├── InsigniaRepository.java
    │           │   ├── JovemRepository.java
    │           │   ├── JovemRequisitoEspecialidadeRepository.java
    │           │   ├── RequisitoDistintivoRepository.java
    │           │   ├── RequisitoEspecialidadeRepository.java
    │           │   ├── RequisitosInsigniaRepository.java
    │           │   └── ResponsaveisRepository.java
    │           └── service
    │               ├── EspecialidadeService.java
    │               ├── JovemService.java
    │               ├── ProgressaoService.java
    │               └── RelatorioService.java
    └── resources
        ├── application.properties
        └── static
            ├── index.html
            ├── js
            │   └── api.js
            └── styles.css
```

## Sobre a aplicação

O projeto segue basicamente a seguinte estrutura: models (+DTO), service, repositories e controller. A lógica de negócios está denrtro do service e o controller faz a integração com o endpoints. 

A criação de DTOs se deu porque a aplicação estava dando problema na serialização dos dados quando a aplicação tentava dar um fetch no banco de dados, e essa foi a solução que eu consegui achar. 

Outro problema na hora do desenvolvimento foi o uso da convenção camelCase para criar as tabelas no ddl-dml.sql. O problema aqui é que o Hibernate usa a notação snake_case para fazer suas queries. A solução foi renomear as tabelas criadas com esse estilo de nome. Uma sugestão para a professora no próximo semestre seria enfatizar aos alunos que usem a notação snake_case para nomear suas tabelas no banco de dados.

A interface da aplicação é uma página web. Tentei deixar a aplicação mais agradável possível, o que acabou tomando tempo. O api.js também me tomou um certo tempop, embora seja basicamente um amontado de códigos para ler dados dos endpoints e criar as correspondentes divs. A aplicação está parcialmente incompleta: ficou faltando os relatórios e a progressão dos jovens.
