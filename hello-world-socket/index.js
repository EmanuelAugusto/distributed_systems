const express = require("express");
const app = express();
const cors = require("cors");
const redis = require("redis");
const uuid = require("uuid");

app.use(cors());
const port = 3001;

app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

const URL_REDIS_CONN = "redis://localhost:6379";

const redisClient = redis.createClient({ url: URL_REDIS_CONN });

redisClient.on("error", (err) => console.log("error_connect", err));

const server = app.listen(port, async () => {
  await redisClient.connect();
  console.log(`listening on port ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const TRANSLATE_CHANNEL = "translate-channel";

const TRANSLATE_CHANNEL_RESPONSE = "translate-channel-response";

const TRANSLATE_CHANNEL_CALLBACK = "translate-channel-callback";

const TRANSLATE_CHANNEL_SERVICE = "translate-channel";

io.on("connection", async function (socket) {
  console.log(socket.id);

  socket.on(TRANSLATE_CHANNEL, function (data) {
    const message = {
      id: uuid.v4(),
      orinalText: data.value,
      date: new Date().toISOString(),
    };

    redisClient.publish(TRANSLATE_CHANNEL_SERVICE, JSON.stringify(message));

    console.log("published_task");
  });

  socket.on(TRANSLATE_CHANNEL_CALLBACK, function (data) {
    console.log("result_task");

    io.emit(TRANSLATE_CHANNEL_RESPONSE, data);
  });
});
