const express = require("express");
const app = express();
const PORT = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
require("dotenv").config();


app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const {
    initializeDatabase,
    getAllTasks,
    getTaskById
} = require("./repository/tasksRepository");

app.get("/tasks", async (req,res)=>{
    const rows = await getAllTasks();

    const tasks = rows.map(task => ({
        ...task,
        done: Boolean(task.done)
    }));

    res.json(tasks);
});

app.get("/tasks/:id", async(req,res)=>{

    const id = Number(req.params.id);

    const task = await getTaskById(id);

    if(!task){

        return res.status(404).json({
            error:"Task not found"
        });

    }

    task.done = Boolean(task.done);

    res.json(task);

});

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.post("/tasks",(req,res)=>{

    const {title}=req.body;

    if(!title || title.trim()===""){

        return res.status(400).json({
            error:"Title is required"
        });

    }

    const result = db.prepare(

        "INSERT INTO tasks(title,done) VALUES (?,?)"

    ).run(title,0);

    const newTask = db.prepare(

        "SELECT * FROM tasks WHERE id=?"

    ).get(result.lastInsertRowid);

    newTask.done = Boolean(newTask.done);

    res.status(201).json(newTask);

});

app.put("/tasks/:id",(req,res)=>{

    const id = Number(req.params.id);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id=?"
    ).get(id);

    if(!task){

        return res.status(404).json({
            error:"Task not found"
        });

    }

    const title =
        req.body.title ?? task.title;

    const done =
        req.body.done ?? Boolean(task.done);

    if(title.trim()===""){

        return res.status(400).json({
            error:"Title cannot be empty"
        });

    }

    db.prepare(

        "UPDATE tasks SET title=?, done=? WHERE id=?"

    ).run(title, done ? 1 : 0, id);

    const updated = db.prepare(

        "SELECT * FROM tasks WHERE id=?"

    ).get(id);

    updated.done = Boolean(updated.done);

    res.json(updated);

});

app.delete("/tasks/:id",(req,res)=>{

    const id = Number(req.params.id);

    const result = db.prepare(

        "DELETE FROM tasks WHERE id=?"

    ).run(id);

    if(result.changes===0){

        return res.status(404).json({
            error:"Task not found"
        });

    }

    res.status(204).send();

});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});


async function startServer() {

    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

}

startServer();