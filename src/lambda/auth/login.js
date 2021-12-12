const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};

const login = async (event) => {
  const { name, password } = JSON.parse(event.body);

  console.log(event.body);

  const createdAt = new Date();
  const id = v4();

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const newPost = {
    id,
    createdAt: createdAt.toISOString(),
    name,
    password,
  };

  await dynamodb
    .put({
      TableName: "Darwin1UserTable",
      Item: newPost,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newPost),
    headers,
  };
};
module.exports = {
  handler: login,
};
