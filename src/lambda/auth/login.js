require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
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

const login = async (event) => {
  const { email, password } = JSON.parse(event.body);

  try {
    const user = await client.query(`select * from users where email=$1`, [
      email,
    ]);
    const checkPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log(user, "DARWIN");

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "username is incorrect!!!",
        }),
        headers,
      };
    }

    if (!checkPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Password is incorrect!!!",
        }),
        headers,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: user.rows[0].username,
        message: "success",
      }),
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
  handler: login,
};
