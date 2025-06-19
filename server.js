import express from 'express';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Criar usuário (POST)
app.post('/usuarios', async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });

  res.status(201).json(user);
});

// Listar todos os usuários (GET)
app.get('/usuarios', async (req, res) => {
  let users;

  if (req.query.name) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name
      }
    });
  } else {
    users = await prisma.user.findMany();
  }

  res.status(200).json(users);
});

// sSEditar usuários
app.put('/usuarios/:id', async (req, res) => {

  const user = await prisma.user.update({
    where: {
      id: req.params.id
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });

  res.status(201).json(user);
});

// Deletar usuários
app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id
    }
  })

  res.status(200).json({ message: 'Usuário deletado com Sucesso!' })
})
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});