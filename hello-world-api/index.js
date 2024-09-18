const express = require("express");
const app = express();
const cors = require("cors");

const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.json([
    {
      orinalText: "Teste um",
      translatedText: "Test one"
    },
    {
      orinalText: "Teste dois",
      translatedText: "Test two"
    },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
