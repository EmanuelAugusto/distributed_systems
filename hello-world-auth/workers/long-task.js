const { parentPort } = require("worker_threads");

const  fs = require('fs');
async function longtask(value) {
  console.log('from_worker')
  return new Promise((resolve, reject) => {
    let counter = 0;

    for (let i = 0; i < 1_000_000; i++) {
      counter++;
      fs.appendFile('counter.txt', `worker:${counter}\n`, function (err) {
        if (err) throw err;
      });
    }

    if (counter === 1_000_000) {
      resolve(counter);
    }
  });
}

parentPort.on("message", async () => {
  const result = await longtask(true);
  parentPort.postMessage(result);
});
