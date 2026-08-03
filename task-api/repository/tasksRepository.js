const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        );
    `);

    const result = await pool.query(
        "SELECT COUNT(*) FROM tasks"
    );

    const count = Number(result.rows[0].count);

    if (count === 0) {
        await pool.query(`
            INSERT INTO tasks(title, done)
            VALUES
            ('Learn Express', false),
            ('Build CRUD API', false),
            ('Read Swagger Docs', true);
        `);
    }
}

async function getAllTasks() {

    const result = await pool.query(
        "SELECT * FROM tasks ORDER BY id"
    );

    return result.rows;

}
async function getTaskById(id) {

    const result = await pool.query(

        "SELECT * FROM tasks WHERE id = $1",

        [id]

    );

    return result.rows[0];

}
async function createTask(title) {

    const result = await pool.query(
        `INSERT INTO tasks(title, done)
         VALUES ($1, $2)
         RETURNING *`,
        [title, false]
    );

    return result.rows[0];

}
async function updateTask(id, title, done) {

    const result = await pool.query(
        `UPDATE tasks
         SET title = $1,
             done = $2
         WHERE id = $3
         RETURNING *`,
        [title, done, id]
    );

    return result.rows[0];

}
async function deleteTask(id) {

    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [id]
    );

    return result.rowCount;

}
module.exports = {
    pool,
    initializeDatabase,
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};