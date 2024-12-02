import express from "express";
import bodyParser from "body-parser";
import { db } from "./db_config.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

// let items = [];

async function getItems() {
  // Gets all items from  the database
  const result = await db.query("SELECT * FROM items");
  const items = [];
  
  result.rows.forEach(item => {
    items.push(item);
  });
  return items;
};

app.get("/", async (req, res) => {
  const items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  
  try {
    db.query("INSERT INTO items (title) VALUES ($1)", [item])
  } catch (error) {
    console.error("Error adding information into database: " + error.message);
    res.status(500).send("Error occured while create todo");
  }

  res.redirect("/");
});

app.post("/edit", (req, res) => {
  try {
    db.query("UPDATE items SET title = $1 WHERE id = $2", [req.body.updatedItemTitle, req.body.updatedItemId])
    res.redirect("/");
  } catch (error) {
      console.error("Error updating todo: " + error.message);
      res.status(500).send("Error occured while editing your todo");
  }
});

app.post("/delete", (req, res) => {
  try {
    db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
    res.redirect("/");
  } catch (error) {
    cconsole.error("Error deleting title from db: " + error.message);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
