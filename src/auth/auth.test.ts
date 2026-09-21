import assert from "node:assert/strict";
import test from "node:test";

import { hashPassword, verifyPassword } from "./password.js";
import { createAuthToken, verifyAuthToken } from "./token.js";

test("password hashes and verifies", async () => {
  const hash = await hashPassword("correct horse battery staple");

  assert.equal(hash.includes("correct horse battery staple"), false);
  assert.equal(await verifyPassword("correct horse battery staple", hash), true);
  assert.equal(await verifyPassword("wrong password", hash), false);
});

test("auth token rejects another secret", async () => {
  const secret = "a".repeat(32);
  const token = await createAuthToken("user-123", secret);

  assert.equal(await verifyAuthToken(token, secret), "user-123");
  await assert.rejects(verifyAuthToken(token, "b".repeat(32)));
});
