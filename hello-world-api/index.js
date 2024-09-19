const express = require("express");
const app = express();
const cors = require("cors");

const Redis = require("ioredis");
const redisDb = new Redis();

const port = 3000;

app.use(cors());

app.get("/", async (req, res) => {
  const KEY = "user";

  const data = await redisDb.get(KEY);
  res.json(JSON.parse(data));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
