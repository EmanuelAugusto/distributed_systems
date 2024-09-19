const redis = require("redis");
const uuid = require("uuid");
const axios = require("axios");
const io = require("socket.io-client");

const Redis = require("ioredis");
const redisDb = new Redis();

const URL_REDIS_CONN = "redis://localhost:6379";

const TRANSLATE_CHANNEL = "translate-channel";

const TRANSLATE_CHANNEL_CALLBACK = "translate-channel-callback";

const redisClient = redis.createClient({ url: URL_REDIS_CONN });

redisClient.on("error", (err) => console.log("error_connect", err));

redisClient.connect().then(() => {
  const socket = io("http://localhost:3001");

  redisClient.subscribe(TRANSLATE_CHANNEL, async (message) => {
    const dataDecoded = JSON.parse(message);

    console.log("translate_init");
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: dataDecoded.orinalText,
          langpair: "en|pt-br",
        },
      }
    );

    if (response.data.responseStatus !== 200) {
      console.log("service_error");

      return;
    }

    const dataTranslated = {
      translatedText: response.data.matches[0].translation,
      orinalText: dataDecoded.orinalText,
    };

    const KEY = "user";

    const data = await redisDb.get(KEY);

    let history = [];

    if (data) {
      history = [...JSON.parse(data)];
    }

    history.push(dataTranslated);

    await redisDb.set("user", JSON.stringify(history));

    socket.emit(TRANSLATE_CHANNEL_CALLBACK, dataTranslated);
  });

  console.log("consumer on");
});
