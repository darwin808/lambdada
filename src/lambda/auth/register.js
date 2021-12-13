require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

// const client = new Pool({
//   host: "user-pg-1.czjpg2bqp6am.us-east-1.rds.amazonaws.com",
//   port: 5432,
//   user: "postgres",
//   password: "12345678",
//   database: "userdb",
// });
const client = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};

const register = async (event) => {
  const { email, username, password } = JSON.parse(event.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const createdAt = new Date();

  try {
    // const result = await client.query(`select * from users`);
    const result = await client.query(
      `insert into users (username,email,password,createdat) values ($1,$2,$3,$4)`,
      [username, email, hashPassword, createdAt]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
      headers,
    };
  }
};
module.exports = {
  handler: register,
};
