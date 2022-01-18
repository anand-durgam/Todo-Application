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

////////////////////////////////////////////////////////////////

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasSearchProperties = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const hasCategoryAndWorkProperties = (requestQuery) => {
  return requestQuery.category !== undefined && requestQuery.work !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasCategoryAndPriorityProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

///////////////////////////////////////////////////////////////
// API 1

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", priority, status, category, work } = request.query;

  switch (true) {
    case hasStatusProperty(request.query):
      getTodoQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND status = '${status}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND priority = '${priority}';`;
      break;
    case hasPriorityAndStatusProperties(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND status = '${status}'
        AND priority = '${priority}';`;
      break;
    case hasSearchProperties(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
      break;
    case hasCategoryAndWorkProperties(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND category = '${category}'
        AND work = '${work}';`;
      break;
    case hasCategoryProperty(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND category = '${category}';`;
      break;
    case hasCategoryAndPriorityProperties(request.query):
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND category = '${category}'
        AND priority = '${priority}';`;
      break;
    default:
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
  }

  data = await db.all(getTodoQuery);
  response.send(data);
});

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

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

  const updateDueDate = `
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

  await db.run(updateDueDate);
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
