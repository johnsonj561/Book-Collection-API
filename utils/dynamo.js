const AWS = require('aws-sdk');
const region = 'us-east-1';
AWS.config.update({ region });

const dynamoClient = new AWS.DynamoDB.DocumentClient();


module.exports = {
  dynamoClient,
}