# Monitor-Inteligente-de-Dispositivos-da-Rede

# NetGuard Pro --- Pré‑Projeto

**Projeto:** Desenvolvimento de um sistema integrado (web e backend)
para o monitoramento de dispositivos de rede através de testes de
conectividade e geração de relatórios de conexão.

------------------------------------------------------------------------

## 1. Título

**NetGuard Pro -- Plataforma Inteligente de Monitoramento e Inventário
de Rede**

------------------------------------------------------------------------

## 2. Tema

Desenvolvimento de uma plataforma integrada (painel web e backend) para
inventariar dispositivos de rede, realizar testes de conectividade
(ping, latência) e gerar relatórios e históricos de disponibilidade.

------------------------------------------------------------------------

## 3. Problema (dor que resolve)

Em redes locais e pequenos a médios ambientes de TI, a falta de
monitoramento centralizado leva a falhas não detectadas e dificuldade de
diagnóstico. A dor real é manter um inventário atualizado, identificar
dispositivos offline rapidamente e entender padrões de instabilidade.

**Pergunta principal:** Como monitorar, de forma simples e centralizada,
a conectividade e o estado de dispositivos de uma rede local, evitando
falhas não detectadas e permitindo visão rápida da saúde da
infraestrutura?

------------------------------------------------------------------------

## 4. Hipótese

Acredita‑se que um sistema integrado que combine inventário e
monitoramento (ping/latência) com histórico permitirá identificar e
reagir a falhas rapidamente, reduzindo tempo de diagnóstico e aumentando
a disponibilidade.

------------------------------------------------------------------------

## 5. Objetivo Geral

Desenvolver uma plataforma completa para monitorar dispositivos de rede,
registrando informações, realizando testes de conectividade e exibindo
resultados em uma interface web, com persistência de logs e geração de
relatórios.

------------------------------------------------------------------------

## 6. Objetivos Específicos

-   Criar uma API REST capaz de cadastrar dispositivos, executar testes
    de conectividade (ping) e registrar logs.
-   Desenvolver uma interface web para gestão, visualização, filtros e
    relatórios.
-   Armazenar todos os dispositivos, horários de teste e resultados em
    um banco de dados relacional.
-   Gerar histórico de testes por dispositivo.
-   Criar dashboard com indicadores simples (online/offline, latência,
    uptime).

------------------------------------------------------------------------

## 7. Justificativa

-   **Impacto prático:** Reduz tempo de inatividade e auxilia
    diagnóstico rápido.
-   **Acadêmico/técnico:** Projeto completo integrando redes + backend +
    frontend.
-   **Operacional:** Útil para laboratórios, escolas, PMEs e ambientes
    com múltiplos dispositivos conectados.

------------------------------------------------------------------------

## 8. Metodologia e Tecnologias

**Tecnologias utilizadas:** - Frontend Web: **React** - Backend:
**Node.js + Express** - Testes de rede: biblioteca npm `ping` /
`node-net-ping` - Banco de Dados: **PostgreSQL** - Autenticação:
**JWT** - Comunicação: **REST API** usando JSON

**Etapas:** 1. Modelagem do banco e arquitetura. 2. Implementação da API
e endpoints principais. 3. Implementação dos testes de conectividade. 4.
Construção da interface web. 5. Integração, testes e documentação.

------------------------------------------------------------------------

## 9. Funcionalidades Previstas (Requisitos)

### Requisitos Obrigatórios

-   Cadastro de dispositivos
-   Listagem com status (online/offline)
-   Teste de conectividade via ping
-   Armazenamento dos logs em banco
-   Consulta via painel Web

### Requisitos Opcionais

-   Alertas visuais
-   Filtros por tipo de dispositivo
-   Gráficos de disponibilidade
-   Teste de portas (TCP)

------------------------------------------------------------------------

## 10. Arquitetura - Visão Geral

-   **Frontend Web:** React
-   **Backend:** Node.js + Express
-   **Banco:** PostgreSQL
-   **Comunicação:** JSON via REST

**Fluxo:** 1. Dispositivos são cadastrados na Web. 2. A API realiza
testes de ping e registra logs. 3. Logs e status são exibidos em tempo
real na interface.

------------------------------------------------------------------------

## 11. Estrutura do Repositório

    netguard-pro/
    ├─ backend/
    │  ├─ src/
    │  ├─ package.json
    ├─ web/
    │  ├─ src/
    │  ├─ package.json
    ├─ docs/
    └─ README.md

------------------------------------------------------------------------

## 12. Banco de Dados --- Esquema SQL

``` sql
CREATE TABLE dispositivos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  tipo VARCHAR(50),
  localizacao VARCHAR(150),
  tags VARCHAR(200),
  ultimo_status BOOLEAN DEFAULT NULL,
  ultimo_teste TIMESTAMP
);

CREATE TABLE logs_testes (
  id SERIAL PRIMARY KEY,
  dispositivo_id INTEGER REFERENCES dispositivos(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL DEFAULT now(),
  sucesso BOOLEAN,
  latencia_ms INTEGER,
  detalhes TEXT
);
```

------------------------------------------------------------------------

## 13. Endpoints Principais

-   `GET /api/dispositivos`
-   `POST /api/dispositivos`
-   `PUT /api/dispositivos/:id`
-   `DELETE /api/dispositivos/:id`
-   `POST /api/dispositivos/:id/testar`
-   `GET /api/dispositivos/:id/logs`

------------------------------------------------------------------------

## 14. Variáveis de Ambiente (.env exemplo)

    PORT=4000
    DATABASE_URL=postgres://user:password@localhost:5432/netguard
    JWT_SECRET=segredo
    PING_TIMEOUT_MS=2000

------------------------------------------------------------------------

## 15. Integrantes e Funções

-   **Bruno Vieira** -- Backend, banco de dados e testes de
    conectividade\
-   **Laerte** -- Desenvolvimento do painel web (React)\
-   **Nathan** -- Documentação, testes e organização do repositório

------------------------------------------------------------------------

## 16. Referências

-   React --- https://react.dev\
-   Express --- https://expressjs.com\
-   PostgreSQL --- https://www.postgresql.org\
-   MDN Web Docs --- https://developer.mozilla.org

------------------------------------------------------------------------

**Licença recomendada:** MIT
