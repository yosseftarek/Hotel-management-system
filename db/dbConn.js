import mysql from "mysql2";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });

export const connectToDb = () => {
  const conn = mysql.createConnection({
    host: "localhost",
    user: `${process.env.DB_USER}`,
    password: "",
    database: `${process.env.DB_NAME}`,
  });

  conn.connect((err) => {
    if (err) console.log(err);
    else console.log("Database Connected");
  });

  return conn;
};