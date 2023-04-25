import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getEdicion(req, res);
    case "PUT":
      return await updateEdicion(req, res);
    case "DELETE":
      return await deleteEdicion(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getEdicion = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.ediciones.findUnique({
      where: {
        idedicion: parseInt(id),
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEdicion = async (req, res) => {
  const { id } = req.query;

  if(req.body.fechaInicio)
  req.body.fechaInicio = new Date(req.body.fechaInicio);
  
  if(req.body.fechaFin)
  req.body.fechaFin = new Date(req.body.fechaFin);

  if(req.body.anio)
  req.body.anio = parseInt(req.body.anio);


  try {
    const result = await prisma.ediciones.update({
      where: {
        idedicion: parseInt(id),
      },
      data: { ...req.body, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const deleteEdicion = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.ediciones.update({
      where: {
        idedicion: parseInt(id),
      },
      data: { status: 0, update_date: new Date() },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
