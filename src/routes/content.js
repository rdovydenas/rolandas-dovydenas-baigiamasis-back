const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const { mysqlConfig } = require("../config");
const { loggedIn } = require("../middleware");

router.post("/add", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    console.log(req);

    const [data] = await con.execute(
      `INSERT INTO items (item_name, item_size, item_color, item_quantity, item_price, item_image) VALUES ('${req.body.name}',
       '${req.body.size}', '${req.body.color}', '${req.body.quantity}', 
       '${req.body.price}', '${req.body.image}' )`
    );

    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.post("/qty/:id", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `UPDATE items SET item_quantity = ${req.body.quantity}
      WHERE id = ${req.params.id}
      `
    );
    const [updated] = await con.execute("SELECT * FROM items");
    con.end();

    return res.status(200).send(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.delete("/item/:id", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `DELETE FROM items
       WHERE id = ${req.params.id}
      `
    );

    con.end();

    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.get("/", loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute("SELECT * FROM items");

    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.get("/users", loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT id FROM users WHERE id=${req.userData.id}`
    );
    con.end();

    res.send(data[0]);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Database error. Please try again later" });
  }
});
module.exports = router;
