# Projeto de API de Produtos com NestJS e TypeORM

Este é um projeto básico de API para gerenciamento de produtos, desenvolvido com o framework [NestJS](https://nestjs.com/) e usando [TypeORM](https://typeorm.io/) como ORM para interagir com o banco de dados PostgreSQL.

## Pré-requisitos

Antes de iniciar, você precisará ter instalado:

- [Node.js](https://nodejs.org/en/download/) (versão 16 ou superior)

## Configuração do Projeto

### 1. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/JoaoMarcosCS/atv-4sem-backend.git)
cd seu-repositorio
```

### 2. Instalar as Dependências

```bash
npm install -g @nestjs/cli
npm install
```

### 3. Rodar o Projeto

```bash
npm run start
```

Endpoints da API
POST /products: Cria um novo produto.
GET /products: Retorna todos os produtos.
GET /products/
: Retorna um produto específico.
PATCH /products/
: Atualiza um produto específico.
DELETE /products/
: Remove um produto específico.
