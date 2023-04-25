import prisma from "./../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getPuesto(req, res);
    case "PUT":
      return await updatePuesto(req, res);
    case "DELETE":
      return await deletePuesto(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getPuesto = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.puestos.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePuesto = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.puestos.update({
      where: {
        id: parseInt(id),
      },
      data: { ...req.body, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const deletePuesto = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.puestos.update({
      where: {
        id: parseInt(id),
      },
      data: { status: 0, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
