# NodeJs-DevClub 👥

Sistema de cadastro de usuários. Construído com Node.js, Express e Prisma com MongoDB Atlas.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- MongoDB Atlas

## Como rodar o projeto

1. Clonar o repositório
   ```
   git clone https://github.com/guilhermez2006/NodeJs-DevClub.git
   cd NodeJs-DevClub
   ```

2. Instale as dependências
   ```
   npm install
   ```

3. Configure o banco de dados
   Crie um arquivo `.env` na raiz do projeto:
   ```
   DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/NomeDoBanco?appName=nome"
   ```

4. Sincronize o banco e gere o cliente do Prisma
   ```
   npx prisma db push
   npx prisma generate
   ```

5. Rode o servidor
   ```
   node server.js
   ```
   O servidor sobe em http://localhost:3000

## Rotas disponíveis

### Usuários

| Método | Rota          | Descrição              |
|--------|---------------|------------------------|
| POST   | /usuarios    | Cria um novo usuário  |
| GET    | /usuarios    | Lista todos os usuários (opcional: ?name=nome) |
| DELETE | /usuarios/:id | Remove um usuário     |
| DELETE | /usuarios/:id | Remove um usuário     |

## Estrutura do projeto

```
├── prisma/
│   └── schema.prisma
├── src/
│   └── main.js
├── img/
├── index.html
├── style.css
├── server.js
├── package.json
└── LICENSE
```