import formidable from "formidable";
import xlsx from "xlsx";
import prisma from "../../../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {

      console.log(err);
      res.status(500).json({ error: "Error al subir el archivo" });
      return;
    }

    try {
        const workbook = xlsx.readFile(files.file.filepath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      let contador = 1;
      for (const catalogo of data) {
        catalogo.status = 1;
        catalogo.idedicion = fields.idedicion ? fields.idedicion : 0;
      }

  
      for (const catalogo of data) {
        let fieldsAntesDeUnir = Object.keys(catalogo);
        let finalFields = [];
        for (const iterator of fieldsAntesDeUnir) {
          finalFields.push("`" + iterator + "`");
        }
        let fields = finalFields.join();
        let values = "";
        for (let value of Object.values(catalogo)) {
          if (typeof value === "string")
            value = `"${value.replace(/['"`]/g, "")}"`;
          values = values + value + ",";
        }
        values = values.substring(0, values.length - 1);
        let query = `replace into catalogo (${fields}) values (${values});`;
        console.log(contador);
        const resultDos = await prisma.$queryRawUnsafe(query);
        contador++;
      }
      res.status(200).json(data);
    } catch (error) {
  
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
}
