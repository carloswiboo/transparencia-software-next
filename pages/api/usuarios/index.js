import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUsuarios(req, res);
    case "POST":
      return await createUsuarios(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getUsuarios = async (req, res) => {
  try {
    const result = await prisma.usuarios.findMany({
      where: {
        status: 1,
      },
      include: {
        tipos_usuarios: true,
        puestos: true, // Return all fields
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const createUsuarios = async (req, res) => {
  var resultado = { ...req.body };

  try {
    const resultCorreos = await prisma.usuarios.findMany({
      where: {
        email: resultado.email,
      },
    });

    if (resultCorreos.length > 0) {
      return res
        .status(500)
        .json({ error: "ya existe un usuario con ese correo" });
    }
    resultado.status = 1;
    resultado.idtipos_usuarios = parseInt(resultado.idtipos_usuarios);
    resultado.idpuesto = parseInt(resultado.idpuesto);
    resultado.contrasena = await hashPassword(resultado.contrasena);
    const result = await prisma.usuarios.create({
      data: resultado,
    });
    return res.status(200).json(result);
  } catch (error) {
    debugger;
    return res.status(500).json({ error });
  }
};

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}
