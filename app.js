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

//API 3 agenda
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;

  const getAgendaTable = `
    SELECT
        *
    FROM
        todo
    WHERE
        due_date LIKE '%${date}%'
    `;

  const agendaArray = await db.all(getAgendaTable);
  response.send(agendaArray);
});

//API 4 POST /todos/
app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const addTodoQuery = `
    INSERT INTO 
        todo (id , todo , priority , status , category , due_date)
    VALUES ('${id}' , '${todo}' , '${priority}' , '${status}' , '${category}' , '${dueDate}')
    `;
  const dbResponse = await db.run(addTodoQuery);
  const todoId = dbResponse.lastID;
  response.send("Todo Successfully Added");
});

//API 5 SCENARIO 1 PUT status = done
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const updateTodoStatus = `
    UPDATE
        todo
    SET 
        id = '${id}',
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = '${dueDate}'
    WHERE 
        id = ${todoId}
    `;
  await db.run(updateTodoStatus);
  response.send("Status Updated");
});

//API 5 SCENARIO 2 PUT priority = high
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const updatePriorityQuery = `
    UPDATE
        todo
    SET 
        id = '${id}',
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = '${dueDate}'
    WHERE 
        id = ${todoId}

    `;
  await db.run(updatePriorityQuery);
  response.send("Priority Updated");
});

//API 5 SCENARIO 3 PUT todo = clean the house
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const updateTodoQuery = `
    UPDATE
        todo
    SET 
        id = '${id}',
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = '${dueDate}'
    WHERE 
        id = ${todoId}
    `;

  await db.run(updateTodoQuery);
  response.send("Todo Updated");
});

//API 5 SCENARIO 4 PUT category = learning
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const updateCategory = `
    UPDATE
        todo
    SET 
        id = '${id}',
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = '${dueDate}'
    WHERE 
        id = ${todoId}
    `;

  await db.run(updateCategory);
  response.send("Category Updated");
});

//API 5 SCENARIO 5 PUT DUE-DATE = 2021-02-12
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const updateDuedate = `
    UPDATE
        todo
    SET 
        id = '${id}',
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = '${dueDate}'
    WHERE 
        id = ${todoId}
    `;

  await db.run(updateDuedate);
  response.send("Due Date Updated");
});

//API 6 DELETE
app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
    DELETE FROM
        todo
    WHERE 
        id = ${todoId}
    `;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
