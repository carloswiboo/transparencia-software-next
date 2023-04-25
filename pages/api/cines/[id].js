import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getCinePorID(req, res);
    case "PUT":
      return await updateCine(req, res);
    case "DELETE":
      return await deleteCine(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getCinePorID = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.cines.findUnique({
      where: {
        idcine: parseInt(id),
      },
      include: {
        salas: true,
        ediciones: true,
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCine = async (req, res) => {
  const { id } = req.query;
  if (req.body.idedicion) req.body.idedicion = parseInt(req.body.idedicion);
  try {
    const result = await prisma.cines.update({
      where: {
        idcine: parseInt(id),
      },
      data: { ...req.body, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCine = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.cines.update({
      where: {
        idcine: parseInt(id),
      },
      data: { status: 0, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    debugger;
    return res.status(500).json({ error: error.message });
  }
};
