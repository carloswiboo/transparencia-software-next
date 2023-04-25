import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getTiposUsuarios(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getTiposUsuarios = async (req, res) => {
  try {
    const result = await prisma.tipos_usuarios.findMany({
      where: {
        status: 1,
      },
    });
    return res.status(200).json(result);
  } catch (error) {

    console.log(error);

    return res.status(500).json({ error });
  }
};
