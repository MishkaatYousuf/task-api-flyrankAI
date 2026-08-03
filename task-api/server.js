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
    getTaskById,
    createTask,
    updateTask,
    deleteTask
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

app.post("/tasks", async (req, res) => {

    const {title} = req.body;

    if(!title || title.trim()===""){

        return res.status(400).json({
            error:"Title is required"
        });

    }

    const newTask = await createTask(title);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req,res)=>{

    const id = Number(req.params.id);

    const task = await getTaskById(id);

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

    const updated = await updateTask(
        id,
        title,
        done
    );

    res.json(updated);

});

app.delete("/tasks/:id", async (req,res)=>{

    const id = Number(req.params.id);

    const deleted = await deleteTask(id);

    if (deleted === 0) {
        return res.status(404).json({
            error: "Task not found"
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