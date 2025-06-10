import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Todo } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();

export const getTodos = async (): Promise<APIGatewayProxyResult> => {
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

export const createTodo = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { title } = JSON.parse(event.body || "{}") as Todo;
  if (!title) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Title is required" }),
    };
  }

  const todo: Todo = {
    id: uuidv4(),
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
