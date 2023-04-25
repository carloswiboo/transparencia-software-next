import { SignJWT, jwtVerify } from "jose";

/* JWT secret key */
let KEY = process.env.JWT_KEY;
KEY = new TextEncoder().encode(KEY);
const alg = "HS256";
/* End JWT Secret Key */

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export function createToken(userInfo) {
  try {
    return new SignJWT(userInfo)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("gironafilmfestival.com")
      .setAudience("gironafilmfestival.com")
      .setExpirationTime("24h")
      .sign(KEY);
  } catch (e) {
    console.log("e:", e);
    return null;
  }
}
