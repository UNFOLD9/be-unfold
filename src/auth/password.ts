import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const keyLength = 64;

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await deriveKey(password, salt);
  return `scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, encodedSalt, encodedHash] = storedHash.split(":");
  if (algorithm !== "scrypt" || !encodedSalt || !encodedHash) return false;

  const expected = Buffer.from(encodedHash, "base64url");
  const actual = await deriveKey(password, Buffer.from(encodedSalt, "base64url"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
