require("dotenv").config()
const express = require("express");
const path = require("path");
const cors = require("cors");
const { json, urlencoded } = require("express");

const port = process.env.PORT;
const app = express();

//configuração para receber a resposta em json e dataFormat
app.use(json());
app.use(urlencoded({extended: false}));

//cors
app.use(cors({credentials: true, origin:"http://localhost:3000"}));

//uploads de imagens
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
//conexão com o banco de dados
require("./config/db");

//rotas
const router = require("./routes/Router");
app.use(router);




app.listen(port, () => {
  console.log(`App rodando na porta: ${port}`)
})