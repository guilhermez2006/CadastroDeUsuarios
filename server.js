import express from 'express';
import pkg from '@prisma/client';
import cors from 'cors';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express();

const allowedOrigins = ['https://guilhermez2006.github.io'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS negado para origem: ' + origin), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // incluir OPTIONS aqui
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Responder preflight OPTIONS
app.options('*', cors());

app.use(express.json());


app.use(express.json());

// Criar usuário (POST)
app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Usuário já cadastrado!' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// Listar todos os usuários (GET)
app.get('/usuarios', async (req, res) => {
  let users;
  if (req.query.name) {
    users = await prisma.user.findMany({
      where: { name: req.query.name }
    });
  } else {
    users = await prisma.user.findMany();
  }
  res.status(200).json(users);
});

// Deletar usuário (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) } // converte id para number
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
