import { verifyAuth } from "./lib/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/api/puestos/:path*"],
};

/*
 * @params Se recibe el req
 * @return Se retorna si es válido o no el token para las APIS de prueba
 */
export async function middleware(req) {
  // validate the user is authenticated
  const token = req.headers.get("authorization");
  const verifiedToken = await verifyAuth(req).catch((err) => {
    return { error: err };
  });
  if (verifiedToken.error) {
    return new NextResponse(
      JSON.stringify({ error: { message: verifiedToken } }),
      { status: 401 }
    );
  } else {
    return NextResponse.next();
  }
}
