import { randomBytes, scryptSync } from "node:crypto";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const passphrase = input.replace(/\r?\n$/, "");
if (!passphrase || passphrase.length > 256) throw new Error("Provide a passphrase through stdin, at most 256 characters.");
const salt = randomBytes(16).toString("hex");
process.stdout.write(`scrypt:${salt}:${scryptSync(passphrase, salt, 64).toString("hex")}\n`);
