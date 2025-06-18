import express from 'express';

const app = express();
app.use(express.json()); // Habilita o uso de req.body com JSON

const users = [];

// Criar usuário (POST)
app.post('/usuarios', (req, res) => {
  console.log(req.body); // mostra apenas os dados enviados
  users.push(req.body); // adiciona o usuário à lista
  res.send("Usuário criado com sucesso!");
});

// Listar todos os usuários (GET)
app.get('/usuarios', (req, res) => {
  res.json(users); // retorna a lista de usuários como JSON
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

/* 
Objetivo:
1. Criar usuários - POST /usuarios
2. Listar todos os usuários - GET /usuarios
3. Editar usuário - PUT /usuarios/:id
4. Deletar usuário - DELETE /usuarios/:id
*/
