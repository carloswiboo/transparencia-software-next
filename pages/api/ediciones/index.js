import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getEdiciones(req, res);
    case "POST":
      return await createEdiciones(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getEdiciones = async (req, res) => {
  try {
    const result = await prisma.ediciones.findMany({
      where: {
        status: 1,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const createEdiciones = async (req, res) => {
  var resultado = req.body;
  resultado.fechaInicio = new Date(resultado.fechaInicio);
  resultado.fechaFin = new Date(resultado.fechaFin);
  resultado.creation_date = new Date();
  resultado.update_date = new Date();
  resultado.status = 1;
  resultado.anio = parseInt(resultado.anio);
  try {
    const result = await prisma.ediciones.create({
      data: resultado,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
