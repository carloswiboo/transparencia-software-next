import prisma from "./../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getPuestos(req, res);
    case "POST":
      return await createPuesto(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getPuestos = async (req, res) => {
  try {
    const result = await prisma.puestos.findMany({
      where: {
        status: 1,
      },
    });
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const createPuesto = async (req, res) => {
  try {
    const result = await prisma.puestos.create({
      data: {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        status: 1,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
