const axios = require("axios");
const uuid = require("uuid");

const mode = process.argv[2] ?? "longtaskmulti";


(async () => {
  const callfunction = () => {
    const requestId = uuid.v4();
    console.time(`time:${requestId}`);
    axios
      .post("http://localhost:3002/"+mode, {
        username: "df7e0b22-b4f0-4041-9451-b17c9a444966",
        password: "Teste123$",
        requestId,
      })
      .then(function (response) {
        console.timeEnd(`time:${requestId}`);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  callfunction();
  setInterval(() => {
    callfunction();
  }, 60000);
})();

//ab -n 10000 -c 1000 -p post_data.json -T application/json http://localhost:3005/login
