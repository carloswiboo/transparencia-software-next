import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getCines(req, res);
    case "POST":
      return await createCines(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getCines = async (req, res) => {
  try {
    const result = await prisma.cines.findMany({
      where: {
        status: 1,
      },
      include:
      {
        salas: true,
        ediciones: true,
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const createCines = async (req, res) => {
  var resultado = req.body;
  resultado.idedicion = parseInt(resultado.idedicion);
  resultado.creation_date = new Date();
  resultado.update_date = new Date();
  resultado.status = 1;

  try {
    const result = await prisma.cines.create({
      data: resultado,
    });
    return res.status(200).json(result);
  } catch (error) {

    debugger;
    return res.status(500).json({ error });
  }
};
