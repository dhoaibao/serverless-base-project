import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Todo } from "../types/todo";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabase } from "../utils/mongodb";

export const getTodos = async (): Promise<APIGatewayProxyResult> => {
  const db = await connectToDatabase(); 
  const todos = await db.collection("todos").find().toArray();
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

  const db = await connectToDatabase();
  const result = await db.collection("todos").insertOne(todo);
  todo.id = result.insertedId.toString();

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Todo created successfully", todo }),
  };
};
