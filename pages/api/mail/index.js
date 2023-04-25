import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await enviarCorreo(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const enviarCorreo = async (req, res) => {
  try {
    const result = await sendEmail({
      to: "carlosestrada122@gmail.com",
      subject: "Welcome to NextAPI",
      html: "Todo bien amigo",
    });
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
