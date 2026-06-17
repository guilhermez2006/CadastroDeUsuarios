import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buscarPorEmail } from "../model/user.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Preencha email e senha.",
      });
    }

    const user = await buscarPorEmail(email);

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaValida) {
      return res.status(401).json({
        error: "Senha inválida.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro interno.",
    });
  }
};