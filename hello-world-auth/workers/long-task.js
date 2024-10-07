const { parentPort } = require("worker_threads");
const bcrypt = require("bcrypt");

async function longtask(value) {
  return new Promise((resolve) => {
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
      counter++;
    }

    if (counter === 20_000_000_000) {
      resolve(counter);
    }
  });
}

parentPort.on("message", async () => {
  const result = await longtask();
  parentPort.postMessage(result);
});
