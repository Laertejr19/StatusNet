StatusNet – Projeto Final (Resumo em Texto – Versão sem Pontos)

O StatusNet é um sistema desenvolvido para facilitar o monitoramento de dispositivos em uma rede. O objetivo do projeto é permitir que o usuário cadastre seus equipamentos, visualize suas informações e realize testes de conectividade para saber se cada dispositivo está online ou offline. A plataforma combina inventário e monitoramento em um único ambiente, oferecendo uma visão clara da disponibilidade dos dispositivos.

A estrutura do projeto é dividida em três partes principais: front-end, back-end e banco de dados. Cada uma possui uma função específica, mas todas trabalham juntas para formar o sistema completo.

Front-end

No front-end foram criadas as telas de interação com o usuário. A interface permite visualizar os dispositivos cadastrados, verificar o status de cada um e realizar ações rápidas. Entre as funcionalidades estão a listagem dos dispositivos, o botão para testar a conectividade em tempo real, o formulário de cadastro de novos dispositivos e a página de histórico onde ficam registrados os testes anteriores. O front-end pode ser desenvolvido tanto em versão web quanto mobile.

Back-end

O back-end é responsável pela lógica do sistema. Foi criada uma API REST que recebe as requisições do front-end e realiza as operações necessárias. A API permite cadastrar, listar, editar e excluir dispositivos, além de executar testes de conectividade reais usando o comando de ping. Também é responsável por registrar os resultados no banco de dados e disponibilizar o histórico quando solicitado.

Banco de Dados

O banco de dados armazena todas as informações do sistema. Ele conta com duas tabelas principais. A tabela "devices" armazena dados como o nome do dispositivo, endereço IP, tipo e data de criação. A tabela "tests" salva os testes realizados, incluindo o status (online ou offline), a latência registrada e o momento em que o teste foi feito. Na pasta "database" ficam o diagrama do banco e o script SQL de criação das tabelas.

Rotas da API

A API conta com rotas voltadas para dispositivos e para testes. Para dispositivos existem rotas para listar, cadastrar, atualizar, excluir e consultar um dispositivo específico. Para testes existem rotas para realizar um teste de ping em tempo real e outra rota para consultar todo o histórico de testes relacionados a um dispositivo.

Estrutura do Repositório

O projeto é organizado em quatro diretórios principais. A pasta "server" contém o código da API. A pasta "database" contém a modelagem do banco e o script SQL. A pasta "web" contém o front-end web. A pasta "mobile" é reservada para quem optar pelo desenvolvimento mobile.

Etapas do Desenvolvimento

O desenvolvimento foi dividido em quatro aulas principais. Na primeira aula foi feito o pré-projeto, levantamento de requisitos e modelagem do banco. Na segunda aula a API foi construída e testada utilizando ferramentas como Postman. Na terceira aula foi criado o front-end, seja web ou mobile. Na quarta aula foram feitos ajustes finais, testes completos e preparação para o pitch de apresentação.

NOME: BRUNO HENRIQUE, LAERT FERRAZ, NATHAN MARTINS
