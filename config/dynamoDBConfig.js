const AWS = require('aws-sdk')

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAVG5QQ6QVIUBJYSVW", "secretAccessKey": "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"
}

AWS.config.update(awsConfig)

let docClient = new AWS.DynamoDB.DocumentClient()

module.exports.docClient = docClient; 