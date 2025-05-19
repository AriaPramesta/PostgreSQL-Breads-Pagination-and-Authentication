var express = require('express');
const { isLoggedIn, formatDateToLocal } = require('../helper/util');
var router = express.Router();

module.exports = function (db) {
  router.get('/', isLoggedIn, async function (req, res, next) {
    try {
      const { page = 1 } = req.query
      const limit = 3
      const offset = limit * (page - 1)
      const query = req.query;

      let sql = `SELECT todos.id AS todo_id, todos.title, todos.deadline, todos.complete FROM todos LEFT JOIN users ON todos.userid = users.id WHERE users.id = ${req.session.user.id}`;
      let sqlcount = `SELECT COUNT(*) AS total FROM todos WHERE userid = ${req.session.user.id}`;
      let queries = [];

      if (query.title) {
        queries.push(`title ilike '%${query.title}%'`);
      }

      if (query.startdate && query.enddate) {
        queries.push(
          `birthdate BETWEEN '${query.startdate}' AND '${query.enddate}'`
        );
      } else if (query.startdate) {
        queries.push(`birthdate >= '${query.startdate}'`);
      } else if (query.enddate) {
        queries.push(`birthdate <= '${query.enddate}'`);
      }

      if (query.married) {
        queries.push(`married = ${query.married}`);
      }

      const todosCount = await db.query(sqlcount)
      const pages = Math.ceil(todosCount.rows[0].total / limit)

      const todos = await db.query(sql)
      res.render('todos/list', { page, pages, data: todos.rows, query: req.query, user: req.session.user })
      console.log("todo.rows: ", todos.rows)
    } catch (error) {
      res.send("failed to load data")
    }

  });

  router.get('/add', isLoggedIn, async function (req, res, next) {
    res.render('todos/addform')
  })

  router.post('/add', isLoggedIn, async function (req, res, next) {
    try {
      const { title } = req.body;
      await db.query("INSERT INTO todos (title, userid ) VALUES ($1, $2)", [title, req.session.user.id])
      res.redirect('/todos')
    } catch (error) {
      console.log(error)
      res.send("failed to input data")
    }
  })

  router.get('/edit/:id', isLoggedIn, async function (req, res, next) {
    try {
      const id = req.params.id;

      // Ambil data dari database
      const result = await db.query('SELECT * FROM todos WHERE id = $1 AND userid = $2', [
        id,
        req.session.user.id,
      ]);

      // Cek apakah data ada
      if (result.rows.length === 0) {
        return res.status(404).send('Data tidak ditemukan atau tidak punya akses');
      }

      const item = result.rows[0]; // data yang akan diedit
      res.render('todos/updateform', { item, user: req.session.user, formatDateToLocal }); // kirim ke view
    } catch (error) {
      console.error(error);
      res.send('Terjadi kesalahan saat mengambil data');
    }
  });

  router.post('/edit/:id', isLoggedIn, async function (req, res, next) {
    try {
      const id = req.params.id;
      const { title, deadline } = req.body;
      const complete = req.body.complete === 'true';

      await db.query(
        'UPDATE todos SET title = $1, deadline = $2, complete = $3 WHERE id = $4 AND userid = $5',
        [title, deadline, complete, id, req.session.user.id]
      );

      res.redirect('/todos');
    } catch (error) {
      console.error(error);
      res.send('Gagal mengupdate data');
    }
  });

  router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM todos WHERE id = $1 AND userid = $2', [id, req.session.user.id]);
    res.redirect('/todos');
  });

  return router;
}