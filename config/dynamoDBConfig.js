const AWS = require('aws-sdk')

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAVG5QQ6QVBRDCKWHE", "secretAccessKey": "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"
}

AWS.config.update(awsConfig)

let docClient = new AWS.DynamoDB.DocumentClient()

module.exports.docClient = docClient; 