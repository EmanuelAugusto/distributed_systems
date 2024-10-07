const { parentPort } = require("worker_threads");
const bcrypt = require("bcrypt");

async function hashAndVerifyPassword(password, hashedPassword) {
  const saltRounds = 15;

  let hashed = null;

  if (!hashedPassword) {
    hashed = await bcrypt.hash(password, saltRounds);
  }

  const isMatch = hashedPassword
    ? await bcrypt.compareSync(password, hashedPassword)
    : null;

  return { hashed, isMatch };
}

parentPort.on("message", async ({ password, hashedPassword }) => {
  const result = await hashAndVerifyPassword(password, hashedPassword);
  parentPort.postMessage(result);
});
