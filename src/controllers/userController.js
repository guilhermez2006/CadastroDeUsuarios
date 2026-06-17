import bcrypt from "bcryptjs";
import { criar, listar, editar, deletar } from "../model/user.js";

const nameRegex = /^[A-Za-zÀ-ÿ\s]{3,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validarUsuario({ name, age, email, password }, validarSenha = true) {
  if (!name || age === undefined || !email || (validarSenha && !password)) {
    return "Todos os campos são obrigatórios.";
  }

  const nome = name.trim();

  if (!nameRegex.test(nome)) {
    return "O nome deve conter apenas letras e possuir entre 3 e 50 caracteres.";
  }

  const idade = Number(age);

  if (!Number.isInteger(idade) || idade < 1 || idade > 120) {
    return "Informe uma idade válida entre 1 e 120 anos.";
  }

  const emailFormatado = email.trim().toLowerCase();

  if (!emailRegex.test(emailFormatado)) {
    return "Informe um e-mail válido.";
  }

  if (validarSenha && !passwordRegex.test(password)) {
    return "A senha deve conter no mínimo 8 caracteres, uma letra e um número.";
  }

  return null;
}

export const createUser = async (req, res) => {
  try {
    const erro = validarUsuario(req.body);

    if (erro) {
      return res.status(400).json({ error: erro });
    }

    const name = req.body.name.trim();
    const age = Number(req.body.age);
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await criar({
      name,
      age,
      email,
      password: hashPassword,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Este e-mail já está cadastrado.",
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor ao criar usuário.",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await listar();
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    return res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao buscar usuários.",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const erro = validarUsuario(
      {
        ...req.body,
        password: "Senha123",
      },
      false,
    );

    if (erro) {
      return res.status(400).json({
        error: erro,
      });
    }

    const user = await editar(req.params.id, {
      name: req.body.name.trim(),
      age: Number(req.body.age),
      email: req.body.email.trim().toLowerCase(),
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Este e-mail já está sendo utilizado.",
      });
    }

    return res.status(500).json({
      error: "Erro ao atualizar usuário.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deletar(req.params.id);

    return res.status(200).json({
      message: "Usuário removido com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao deletar usuário.",
    });
  }
};
