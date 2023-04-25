import prisma from "../../../lib/prisma";
import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateImage(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const updateImage = async (req, res) => {
  const form = formidable({ multiples: true });
  form.maxFileSize = 300 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al subir la imagen." });
      return;
    }

    const { id } = fields;
    const file = files.image;
    const fileName = files.image.originalFilename;
    // Aquí guardamos la imagen en una carpeta en el proyecto
    const nombreArchivo = `${Date.now().toString()}_${fileName}`;
    const path = `public/images/${nombreArchivo}`;
    const oldPath = files.image.filepath;

    fs.rename(oldPath, path, async (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar la imagen." });
        return;
      }

      // Aquí guardamos la información de la imagen en la base de datos
      const image = await prisma.patrocinadores.update({
        where: {
          idpatrocinador: parseInt(id),
        },
        data: { imagenUrl: "images/" + nombreArchivo, update_date: new Date() },
      });

      res.status(200).json({
        message: "Imagen de patrocindor subida correctamente.",
        image,
      });
    });
  });
};
