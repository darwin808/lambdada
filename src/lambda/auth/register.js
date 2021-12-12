const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

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
  const id = v4();

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const result = await dynamodb
      .get({
        TableName: "Darwin1UserTable",
        Key: { email },
      })
      .promise();

    if (result.Item.email === email) {
      return {
        statusCode: 400,
        body: JSON.stringify(result),
        headers,
      };
    }

    const newPost = {
      id,
      createdAt: createdAt.toISOString(),
      email,
      username,
      password: hashPassword,
    };
    await dynamodb
      .put({
        TableName: "Darwin1UserTable",
        Item: newPost,
        ConditionExpression: "attribute_not_exists(email)",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newPost),
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
