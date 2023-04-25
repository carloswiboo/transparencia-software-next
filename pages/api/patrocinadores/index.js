import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getPatrocinadores(req, res);
    case "POST":
      return await createPatrocinadores(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getPatrocinadores = async (req, res) => {
  try {
    const result = await prisma.patrocinadores.findMany({
      where: {
        status: 1,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const createPatrocinadores = async (req, res) => {
  var resultado = { ...req.body };

  resultado.status = 1;
  resultado.idedicion = parseInt(resultado.idedicion);
 
  if(resultado.orden)
  {
    resultado.orden = parseInt(resultado.orden);
  }

  try {
    const result = await prisma.patrocinadores.create({
      data: resultado,
    });
    return res.status(200).json(result);
  } catch (error) {
    debugger;
    return res.status(500).json({ error });
  }
};
