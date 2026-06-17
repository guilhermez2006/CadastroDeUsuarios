import pkg from "@prisma/client"
const { PrismaClient } = pkg
const prisma = new PrismaClient()

// Toda query do banco fica aqui
export const criar = (data) => prisma.user.create({ data })
export const listar = () => prisma.user.findMany({ orderBy: { name: "asc" } })
export const buscarPorId = (id) => prisma.user.findUnique({ where: { id } })
export const buscarPorEmail = (email) => prisma.user.findUnique({ where: { email } })
export const editar = (id, data) => prisma.user.update({ where: { id }, data })
export const deletar = (id) => prisma.user.delete({ where: { id } })