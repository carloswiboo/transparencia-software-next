import prisma from "../../../lib/prisma";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUsuario(req, res);
    case "PUT":
      return await updateUsuario(req, res);
    case "DELETE":
      return await deleteUsuario(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getUsuario = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.usuarios.findUnique({
      where: {
        idusuario: parseInt(id),
      },
      include: {
        tipos_usuarios: true,
        puestos: true, // Return all fields
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUsuario = async (req, res) => {
  const { id } = req.query;

  var resultado = { ...req.body };

  if (resultado.idtipos_usuarios) {
    resultado.idtipos_usuarios = parseInt(resultado.idtipos_usuarios);
  }
  if (resultado.idpuesto) {
    resultado.idpuesto = parseInt(resultado.idpuesto);
  }

  if (resultado.contrasena) {
    resultado.contrasena = await hashPassword(resultado.contrasena);
  }

  if (resultado.email) {
    return res.status(500).json({
      error:
        "No puedes actualizar el correo electrónico, comunícate a informática",
    });
  }

  try {
    const resultCorreos = await prisma.usuarios.findUnique({
      where: {
        idusuario: parseInt(id),
      },
    });

    const result = await prisma.usuarios.update({
      where: {
        idusuario: parseInt(id),
      },
      data: { ...resultado, update_date: new Date() },
    });

    if (resultado.contrasena) {
      try {
        const result = await sendEmail({
          to: resultCorreos.email,
          subject: "Se ha cambiado la contraseña para acceder a tu cuenta GFF",
          html: "Tu nueva contraseña es: " + req.body.contrasena,
        });
        return res.status(200).json(result[0]);
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }

    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    debugger;
    return res.status(500).json({ error: error });
  }
};

const deleteUsuario = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.usuarios.update({
      where: {
        idusuario: parseInt(id),
      },
      data: { status: 0, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
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
