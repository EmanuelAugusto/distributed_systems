const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");

const { Worker } = require("worker_threads");
const cluster = require("cluster");
const os = require("os");

const numCPUs = os.cpus().length;

const Redis = require("ioredis");

/*if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {*/
const redisDb = new Redis('redis://redis:6379');

const usersDB = {};

const modeHashCheck = process.argv[2] ?? "normal";

const port = 3005;

app.use(cors());
app.use(express.json());

function runWorker(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./workers/password-worker.js");

    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });

    worker.postMessage({ password, hashedPassword });
  });
}

function runWorkerLongTask() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./workers/long-task.js");

    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });

    worker.postMessage(true);
  });
}

app.post("/auth/login", async (req, res) => {
  const { username, password, requestId } = req.body;

  const data = await redisDb.get(username);

  if (!data) {
    return res.status(404).send("user_not_found");
  }

  const user = JSON.parse(data);

  console.time(`time:${requestId}`);

  let isMatch = false;

  if (modeHashCheck == "normal") {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    const check = await runWorker(password, user.password);
    isMatch = check.isMatch;
  }
  console.timeEnd(`time:${requestId}`);
  if (!isMatch) {
    return res.status(404).send("user_not_found");
  }

  return res.json(user);
});

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  const data = await redisDb.get(username);

  if (data) {
    return res.status(400).send("user_exist");
  }

  console.time(`time:${username}`);

  const { hashed } = await runWorker(password, null);
  console.timeEnd(`time:${username}`);

  const user = { username, password: hashed };

  await redisDb.set(username, JSON.stringify(user));

  res.status(200).json(user);
});

app.post("/auth/longtasknormal", async (req, res) => {
  let counter = 0;
  for (let i = 0; i < 20_000_000_000; i++) {
    counter++;
    console.log(`${i}`)
  }
  res.status(200).send(`result is ${counter}`);
});

app.post("/auth/longtaskmulti", async (req, res) => {
  const counter = await runWorkerLongTask();

  res.status(200).send(`result is ${counter}`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
//}
