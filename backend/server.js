const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask-ai", async (req, res) => {
  const response = await axios.post("http://localhost:8000/chat", {
    message: req.body.message,
  });

  res.json(response.data);
});

app.listen(5000, () => {
  console.log("Backend running");
});