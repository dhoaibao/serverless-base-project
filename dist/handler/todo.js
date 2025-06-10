"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = exports.getTodos = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const getTodos = async () => {
    // const todos = await dynamoDb
    //   .scan({
    //     TableName: process.env.TABLE_NAME!,
    //   })
    //   .promise();
    const todos = [
        { id: "1", title: "Todo 1", completed: false },
        { id: "2", title: "Todo 2", completed: false },
        { id: "3", title: "Todo 3", completed: false },
    ];
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Todos fetched successfully", todos }),
    };
};
exports.getTodos = getTodos;
const createTodo = async (event) => {
    const { title } = JSON.parse(event.body || "{}");
    if (!title) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Title is required" }),
        };
    }
    const todo = {
        id: (0, uuid_1.v4)(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    // await dynamoDb
    //   .put({
    //     TableName: process.env.TABLE_NAME!,
    //     Item: todo,
    //   })
    //   .promise();
    return {
        statusCode: 201,
        body: JSON.stringify({ message: "Todo created successfully", todo }),
    };
};
exports.createTodo = createTodo;
