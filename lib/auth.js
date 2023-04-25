import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";
import { USER_TOKEN, getJwtSecretKey } from "./constants";

/* JWT secret key */
let KEY = process.env.JWT_KEY;
KEY = new TextEncoder().encode(KEY);
const alg = "HS256";
/* End JWT Secret Key */

export async function verifyAuth(req) {
  const token = req.headers.get("authorization");
  if (!token) throw "Token no proporcionado";
  try {
    const verified = await jwtVerify(token, KEY);
    return verified;
  } catch (err) {
    throw "Error de token";
  }
}
