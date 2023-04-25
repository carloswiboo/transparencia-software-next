import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getPatrocinador(req, res);
    case "PUT":
      return await updatePatrocinador(req, res);
    case "DELETE":
      return await deletePatrocinador(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getPatrocinador = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.patrocinadores.findUnique({
      where: {
        idpatrocinador: parseInt(id),
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePatrocinador = async (req, res) => {
  const { id } = req.query;

  var resultado = { ...req.body };

  if (resultado.idedicion) {
    resultado.idedicion = parseInt(resultado.idedicion);
  }
  if (resultado.orden) {
    resultado.orden = parseInt(resultado.orden);
  }

  try {
    const result = await prisma.patrocinadores.update({
      where: {
        idpatrocinador: parseInt(id),
      },
      data: { ...resultado, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    debugger;
    return res.status(500).json({ error: error });
  }
};

const deletePatrocinador = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.patrocinadores.update({
      where: {
        idpatrocinador: parseInt(id),
      },
      data: { status: 0, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
