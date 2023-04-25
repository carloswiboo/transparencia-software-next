import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./../../../lib/prisma";
import { createToken } from "./../../../middleware/utils";

export default async function handler(req, res) {
  const { method } = req;
  try {
    switch (method) {
      case "POST":
        /* Get Post Data */
        const { email, password } = req.body;
        /* Any how email or password is blank */
        if (!email || !password) {
          return res.status(400).json({
            status: "error",
            error: "Usuario / Contraseña no proporccionados",
          });
        }
        /* Check user email in database */

        const user = await prisma.usuarios.findMany({
          where: {
            email: email,
          },
        });
        /* Check if exists */
        if (user.length == 0) {
          /* Send error with message */
          res
            .status(400)
            .json({ status: "error", error: "Usuario No Encontrado" });
        }
        /* Variables checking */
        if (user) {
          const userId = user[0].idusuario,
            userEmail = user[0].email,
            userPassword = user[0].contrasena;
          /* Check and compare password */
          bcrypt.compare(password, userPassword).then((isMatch) => {
            /* User matched */
            if (isMatch) {
              /* Create JWT Payload */
              const payload = {
                id: userId,
                nombres: user[0].nombres,
                apellidos: user[0].apellidos,
                ut: user[0].idtipos_usuarios,
                email: userEmail,
              };
              /* Sign token */
              createToken(payload).then((token) => {
                res.status(200).json({
                  success: true,
                  token: token,
                });
              });
            } else {
              /* Send error with message */
              res
                .status(400)
                .json({ status: "error", error: "Contraseña Incorrecta" });
            }
          });
        }
        break;
      case "PUT":
        break;
      case "PATCH":
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
}
