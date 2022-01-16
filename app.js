const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

//get all details in todo table
app.get("/", async (request, response) => {
  const getAllDetails = `
    SELECT 
      *  
    FROM 
        todo`;

  const detailsArray = await db.all(getAllDetails);
  response.send(detailsArray);
});

// API 1 status = to do
app.get("/todos/", async (request, response) => {
  const { status } = request.query;

  const todoStatusTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        status LIKE '%${status}%'
    `;

  const statusArray = await db.all(todoStatusTable);
  response.send(statusArray);
});

// priority = high
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;

  const priorityTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        priority LIKE '%${priority}%'
    `;

  const result = await db.all(priorityTable);
  response.send(result);
});

// priority = high , status = in progress
app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;

  const statusInProgressTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        priority LIKE '%${priority}%';
        status LIKE '%${status}%'
    `;

  const output = await db.all(statusInProgressTable);
  response.send(output);
});

// search_q = buy
app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;

  const searchTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        todo LIKE '%${search_q}%'
    `;

  const searchArray = await db.all(searchTable);
  response.send(searchArray);
});

// category = work , status = done
app.get("/todos/", async (request, response) => {
  const { category, status } = request.query;

  const categoryTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        category LIKE '%${category}%' AND
        status LIKE '%${status}%'
    `;

  const categoryArray = await db.all(categoryTable);
  response.send(categoryArray);
});

// category = home
app.get("/todos/", async (request, response) => {
  const { category } = request.query;

  const categoryArray = `
    SELECT
        *
    FROM
        todo
    WHERE
        category LIKE '%${category}%'
    `;

  const resultArray = await db.all(categoryArray);
  response.send(resultArray);
});

// category = learning , priority = high
app.get("/todos/", async (request, response) => {
  const { category, priority } = request.query;

  const categoryAndPriority = `
    SELECT
        *
    FROM
        todo
    WHERE
        category LIKE '%${category}%' AND
        priority LIKE '%${priority}%'
    `;

  const resultOfCategoryAndPriority = await db.all(categoryAndPriority);
  response.send(resultOfCategoryAndPriority);
});

//API 2 todoId
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoId = `
    SELECT
        *
    FROM
        todo
    WHERE
        id = ${todoId}
    `;

  const resultTodoId = await db.all(getTodoId);
  response.send(resultTodoId);
});

module.exports = app;
