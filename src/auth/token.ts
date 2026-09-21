import { jwtVerify, SignJWT } from "jose";

const issuer = "unfold-api";
const audience = "unfold-web";

function key(secret: string) {
  return new TextEncoder().encode(secret);
}

export function createAuthToken(userId: string, secret: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key(secret));
}

export async function verifyAuthToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, key(secret), { issuer, audience });
  if (!payload.sub) throw new Error("Token subject missing");
  return payload.sub;
}
