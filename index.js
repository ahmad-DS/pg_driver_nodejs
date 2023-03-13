const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("hi welcome to home");
});

// create a todo
app.post("/create", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.send(newTodo);
  } catch (error) {
    console.log(err);
  }
});

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
    res.send(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.send(todo.rows);
  } catch (error) {
    console.log(error.message);
  }
});
//update a todo
app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.send("todo updated");
  } catch (error) {
    console.log(error);
    // console.log(error.message);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.send("todo deleted");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("app is running on http://localhost:8080");
});
