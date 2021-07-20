const middleware = require("../middleware");
const express = require("express");
const router = express.Router();
const { mysqlConfig } = require("../config");
const mysql = require("mysql2/promise");
const { loggedIn } = require("../middleware");

router.post("/add", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `INSERT INTO items (item_name, item_size, item_color, item_quantity) VALUES ('${String(
        req.body.name
      )}', '${String(req.body.size)}', '${req.body.color}', '${String(
        Number(req.body.quantity)
      )}')`
    );
    con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.post("/qty/:aidi", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `UPDATE items SET item_quantity = ${req.body.quantity}
      WHERE id = ${req.params.aidi}
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

router.delete("/:aidi", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `DELTE items WHERE id = ${req.params.aidi}
      `
    );

    con.end();

    return res.status(200).send("Item deleted from db");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute("SELECT * FROM items");
    con.end();

    if (data.length === 0) {
      return res.send({ message: "No items" });
    }

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Database error" });
  }
});

module.exports = router;