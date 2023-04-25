import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getPatrocinador(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getPatrocinador = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await prisma.patrocinadores.findMany({
      where: {
        idedicion: parseInt(id),
      },
    });
    return res.status(200).json(result === null ? [] : result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
