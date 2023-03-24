require("dotenv").config();
const mongoose = require("mongoose");
const bdUser = process.env.BD_USER;
const bdPassword = process.env.BD_PASS;

//conexão com o banco
const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${bdUser}:${bdPassword}@cluster0.l8oz5lf.mongodb.net/test`
    );
    console.log('Conectou ao banco');
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};
conn();

module.exports = conn;
