# Cadastro de Usuários - API 👥

Sistema de cadastro de usuários com autenticação JWT, CRUD completo, validações e arquitetura MVC. Construída com Node.js, Express e Prisma com MongoDB Atlas.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- MongoDB Atlas
- JSON Web Token (JWT)
- Bcryptjs

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/guilhermez2006/CadastroDeUsuarios
cd CadastroDeUsuarios
```

### 2. Instale as dependências
```bash
npm install
npm install cors
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/NomeDoBanco?appName=nome"
JWT_SECRET=suaChaveSecretaAqui123!@#
```

### 4. Sincronize o banco e gere o client do Prisma

```bash
npx prisma db push
npx prisma generate
```

### 5. Rode o servidor

```bash
node --watch server.js
```

O servidor sobe em `http://localhost:3000`

## Rotas disponíveis

### Autenticação (públicas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /cadastro | Cria um novo usuário |
| POST | /login | Autentica e retorna o token JWT |

### Usuários (protegidas — requer token JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /usuarios | Lista todos os usuários cadastrados |
| GET | /usuarios/:id | Busca um usuário por ID |
| PUT | /usuarios/:id | Edita um usuário |
| DELETE | /usuarios/:id | Remove um usuário |

> Para acessar as rotas protegidas, envie o token no header:
>
> `Authorization: Bearer <seu_token>`

## Estrutura do projeto

```text
CadastroDeUsuarios/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── Controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── Middlewares/
│   │   └── auth.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── js/
│       └── script.js
├── img/
│   └── preview.png
├── index.html
├── .env
├── package.json
└── server.js
```
