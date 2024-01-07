# Este arquivo contem as instruções e descrição do projeto

## O Projeto

Este projeto consite em uma RESTAPI para cadastro de documento judiciais. 

Ao cadastrar um documento enviando arquivo, titulo e categoria o sistema ira extrair o texto, e identificar as palavras chaves utilizando um algoritimo de nlp. Para efetuar o cadastro o usuário pracisa estar logado no sistema, esta identificação é feita através do token de acesso que exipra em 1h após login.

Ao editar um documento, uma versão é salva com o conteúdo extraido do arquivo e a data de modificação e o autor da modificação.

O sistema possui auditoria, toda ação feita por qualquer usuário é armazenada e posteriormente pode ser visualizada apenas por administradores.

Quando usuários não-adminsitradores deletam ou editam arquivos um e-mail é enviado para o administrador do sistema.

O sistema de arquivos possui exclusão segura com soft delete, uma exclusão virtual que irá ocultar o arquivo para os usuários do sistema.

Ao cadastrar um novo usuário automáticamente este tera a permissão de usuário.

## Instruções

Para executar este projeto preencha o .env com as chaves necessárias, tanto para acesso ao banco mongo de sua escolhar, tanto para o envio de emails utilizando o serviço do gmail, é necessário habilitar a opção de acesso de aplicações não seguras no gmail.

Após preencher o .env certifique-se de utilizar a versão 16.20 do node.js

Execute o comando ```npm run dev``` para executar o ambiente local de desenvolvimento, o usuário admin será criado automáticamente no banco de dados.

Execute o comando ```npm start``` para executar sem o nodemon, este comando é indicado para ambientes de homologação/produção

Execute ```npm test``` para executar os testes unitários implementados no sistema

Após executar o sistema a documentação para a api estará disponível em /api-docs

## Estratégia para migração de sistemas legados

Ao lidar com sistemas legados normalmente não temos como garantir a compatibilidade dos bancos de dados, uma maneira indicada para esta situação é realizar uma análise minuciosa do banco antigo para mapear quais informações serão migradas. Após isso, montar um script que será responsável por obter as informações do banco antigo e disponibilizar para o banco atual do sistema. Esta segunda etapa pode ser feita em conjunto com a primeira em um único script acessando ambos os bancos ao mesmo tempo. Entretanto possui um risco associado a perca de conexão. Outra maneira é criar um conjunto temporário que será inserido no banco atual somente ao final da conexão com o banco antigo. 

Este script pode ser feito em diversas linguagens de programação, a definição pode ser feita com base na linguagem utilizada no sitema legado. Ou mediante a preferencia da equipe.
